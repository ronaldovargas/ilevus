using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using ilevus.Models;
using AspNet.Identity.MongoDB;

namespace ilevus.App_Start
{
    public class IlevusIdentityContext : IDisposable
	{
		public static IlevusIdentityContext Create()
		{
			// todo add settings where appropriate to switch server & database in your own application
			var client = new MongoClient("mongodb://localhost:27017");
			var database = client.GetDatabase("ilevus");
			var users = database.GetCollection<IlevusUser>("users");
			var roles = database.GetCollection<IlevusRole>("roles");
			return new IlevusIdentityContext(users, roles);
		}

		private IlevusIdentityContext(IMongoCollection<IlevusUser> users, IMongoCollection<IlevusRole> roles)
		{
			Users = users;
			Roles = roles;
		}

		public IMongoCollection<IlevusRole> Roles { get; set; }

		public IMongoCollection<IlevusUser> Users { get; set; }

		public Task<List<IlevusRole>> AllRolesAsync()
		{
			return Roles.Find(r => true).ToListAsync();
		}

		public void Dispose()
		{
		}
	}
}