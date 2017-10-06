using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Linq.Expressions;
using Norm;

namespace ilevus.Repository
{
	public class MongoRepository : IRepository
	{
		private readonly IMongo _provider;
		private Norm.IMongoDatabase _db => this._provider.Database;

		public MongoRepository()
		{
			_provider = Mongo.Create(ConfigurationManager.ConnectionStrings["connectionstrings"].ConnectionString);
		}

		public void Delete<T>(Expression<Func<T, bool>> expression) where T : class, new()
		{
			var items = All<T>().Where(expression);
			foreach (T item in items)
			{
				Delete(item);
			}
		}

		public void Delete<T>(T item) where T : class, new()
		{
			_db.GetCollection<T>().Delete(item);
		}

		public void DeleteAll<T>() where T : class, new()
		{
			_db.DropCollection(typeof(T).Name);
		}


		public IQueryable<T> Find<T>(Expression<Func<T, bool>> expression) where T : class, new()
		{
			return All<T>().Where(expression);
		}

		public T Single<T>(Expression<Func<T, bool>> expression) where T : class, new()
		{
			return All<T>().Where(expression).SingleOrDefault();
		}

		public IQueryable<T> All<T>() where T : class, new()
		{
			return _db.GetCollection<T>().AsQueryable();
		}

		public IQueryable<T> All<T>(int page, int pageSize) where T : class, new()
		{
			return PagingExtensions.Page(All<T>(), page, pageSize);
		}

		public void Add<T>(T item) where T : class, new()
		{
			_db.GetCollection<T>().Save(item);
		}

		public void Add<T>(IEnumerable<T> items) where T : class, new()
		{
			foreach (T item in items)
			{
				Add(item);
			}
		}

		public void Dispose()
		{
			_provider.Dispose();
		}
	}
}
