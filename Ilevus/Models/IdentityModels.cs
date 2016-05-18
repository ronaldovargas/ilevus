using System;
using ElCamino.AspNet.Identity.Dynamo;
using ElCamino.AspNet.Identity.Dynamo.Model;
using Microsoft.AspNet.Identity;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;
using ElCamino.AspNet.Identity.Dynamo.Helpers;
using Amazon.DynamoDBv2.DataModel;
using ilevus.App_Start;

namespace ilevus.Models
{
    [DynamoDBTable(ElCamino.AspNet.Identity.Dynamo.Constants.TableNames.UsersTable)]
    public class IlevusUser : IdentityUser<string, IlevusUserLogin, IlevusUserRole, IlevusUserClaim>, IGenerateKeys
    {
        public IlevusUser()
        {
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(IlevusUserManager manager, string authenticationType)
        {
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }

        /// <summary>
        /// Generates Row, Partition and Id keys.
        /// All are the same in this case
        /// </summary>
        public void GenerateKeys()
        {
            Id = PeekRowKey();
            UserId = Id;
        }

        /// <summary>
        /// Generates the RowKey without setting it on the object.
        /// In this case, just returns a new guid
        /// </summary>
        /// <returns></returns>
        public string PeekRowKey()
        {
            return Guid.NewGuid().ToString();
        }
    }

    [DynamoDBTable(ElCamino.AspNet.Identity.Dynamo.Constants.TableNames.RolesTable)]
    public class IlevusRole : IdentityRole<string, IlevusUserRole>, IGenerateKeys
    {
        public IlevusRole()
        {
            this.Id = Guid.NewGuid().ToString();
        }

        public IlevusRole(string name)
            : this()
        {
            this.Name = name;
        }

        // Add any custom Role properties/code here

        /// Generates Row and Id keys.
        /// Partition key is equal to the UserId
        /// </summary>
        public void GenerateKeys()
        {
            Id = PeekRowKey();
        }

        /// <summary>
        /// Generates the RowKey without setting it on the object.
        /// </summary>
        /// <returns></returns>
        public string PeekRowKey()
        {
            return KeyHelper.GenerateRowKeyIdentityRole(Name);
        }
    }
    
    public class IlevusDbContext : IdentityCloudContext<IlevusUser, IlevusRole,
        string, IlevusUserLogin, IlevusUserRole, IlevusUserClaim>
    {
        private IlevusDbContext() : base()
        {

        }
        public static IlevusDbContext Create()
        {
            return new IlevusDbContext();
        }
    }


    [DynamoDBTable(ElCamino.AspNet.Identity.Dynamo.Constants.TableNames.UsersTable)]
    public class IlevusUserClaim : IdentityUserClaim { }
    [DynamoDBTable(ElCamino.AspNet.Identity.Dynamo.Constants.TableNames.UsersTable)]
    public class IlevusUserLogin : IdentityUserLogin { }
    [DynamoDBTable(ElCamino.AspNet.Identity.Dynamo.Constants.TableNames.UsersTable)]
    public class IlevusUserRole : IdentityUserRole { }

    // Most likely won't need to customize these either, but they were needed because we implemented
    // custom versions of all the other types:
    public class IlevusUserStore
        : UserStore<IlevusUser, IlevusRole, string,
            IlevusUserLogin, IlevusUserRole,
            IlevusUserClaim>, IUserStore<IlevusUser, string>,
        IDisposable
    {
        public IlevusUserStore()
            : this(IlevusDbContext.Create())
        {
        }
        public IlevusUserStore(IlevusDbContext context)
            : base(context)
        {
        }
    }
    /*
    public class IlevusRoleStore : RoleStore<IlevusRole, string, IlevusUserRole>,
            IQueryableRoleStore<IlevusRole, string>, IRoleStore<IlevusRole, string>, IDisposable
    {
        public IlevusRoleStore() : this(new IdentityCloudContext()) {}
       public IlevusRoleStore(IdentityCloudContext context) : base(context) {}
    }
    */

    /// <summary>
    /// Foi necessário pegar a implementação completa nesta classe devido à diferenças quanto
    /// a customização do contexto de banco de dados.
    /// </summary>
    /// <see cref="https://identitydynamodb.codeplex.com/workitem/1824" />
    public class IlevusRoleStore : IQueryableRoleStore<IlevusRole, string>, IRoleStore<IlevusRole, string>, IDisposable
    {
        private bool _disposed;

        public IlevusRoleStore() : this(IlevusDbContext.Create()) { }
        public IlevusRoleStore(IlevusDbContext context)
        {
            this.Context = context;
        }

        public async Task CreateTableIfNotExistsAsync()
        {
            await Context.CreateRoleTableAsync();
        }

        public async virtual Task CreateAsync(IlevusRole role)
        {
            ThrowIfDisposed();
            if (role == null)
            {
                throw new ArgumentNullException("role");
            }

            role.GenerateKeys();

            await Context.SaveAsync<IlevusRole>(role, new DynamoDBOperationConfig()
            {
                TableNamePrefix = Context.TablePrefix,
                ConsistentRead = true,
            });

        }

        public async virtual Task DeleteAsync(IlevusRole role)
        {
            ThrowIfDisposed();
            if (role == null)
            {
                throw new ArgumentNullException("role");
            }
            await Context.DeleteAsync<IlevusRole>(role, new DynamoDBOperationConfig()
            {
                TableNamePrefix = Context.TablePrefix,
                ConsistentRead = true,
            });

        }

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed && disposing)
            {
                if (Context != null)
                {
                    Context.Dispose();
                }
                _disposed = true;
                Context = null;
            }
        }

        public async Task<IlevusRole> FindByIdAsync(string roleId)
        {
            this.ThrowIfDisposed();
            return await FindIdAsync(roleId.ToString());
        }

        public async Task<IlevusRole> FindByNameAsync(string roleName)
        {
            this.ThrowIfDisposed();
            return await FindIdAsync(KeyHelper.GenerateRowKeyIdentityRole(roleName));
        }

        private Task<IlevusRole> FindIdAsync(string roleId)
        {
            return Context.LoadAsync<IlevusRole>(roleId, new DynamoDBOperationConfig()
            {
                TableNamePrefix = Context.TablePrefix,
                ConsistentRead = true,
            });
        }

        private void ThrowIfDisposed()
        {
            if (this._disposed)
            {
                throw new ObjectDisposedException(base.GetType().Name);
            }
        }

        public async virtual Task UpdateAsync(IlevusRole role)
        {
            ThrowIfDisposed();
            if (role == null)
            {
                throw new ArgumentNullException("role");
            }

            var batchWrite = Context.CreateBatchWrite<IlevusRole>(new DynamoDBOperationConfig()
            {
                TableNamePrefix = Context.TablePrefix,
                ConsistentRead = true,
            });

            IGenerateKeys g = role as IGenerateKeys;
            if (!g.PeekRowKey().Equals(role.Id.ToString(), StringComparison.Ordinal))
            {
                batchWrite.AddDeleteKey(role.Id.ToString());
            }
            g.GenerateKeys();
            batchWrite.AddPutItem(role);
            await Context.ExecuteBatchWriteAsync(new BatchWrite[] { batchWrite });
        }

        public IlevusDbContext Context { get; private set; }

        /// <summary>
        /// Changing from NotImplemented exception to NotSupported to avoid code analysis message.
        /// </summary>
        public IQueryable<IlevusRole> Roles
        {
            get
            {
                throw new NotSupportedException();
            }
        }

    }
}