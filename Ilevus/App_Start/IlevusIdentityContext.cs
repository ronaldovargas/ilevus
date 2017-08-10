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
			//	var client = new MongoClient("mongodb://52.191.132.220:27017");
			var mongoCredential = MongoCredential.CreateCredential("admin", "root", ("kCm9yifugdfR"));

			var mongoClientSettings = new MongoClientSettings
			{
				Credentials = new[] { mongoCredential },
				Server = new MongoServerAddress("52.191.132.220", 27017)
			
			};

			var client = new MongoClient(mongoClientSettings);

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