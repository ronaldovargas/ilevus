using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;

namespace ilevus.Repository
{
	public interface IRepository : IDisposable
	{
		void Delete<T>(Expression<Func<T, bool>> expression) where T : class, new();
		void Delete<T>(T item) where T : class, new();
		void DeleteAll<T>() where T : class, new();
		T Single<T>(Expression<Func<T, bool>> expression) where T : class, new();
		System.Linq.IQueryable<T> All<T>() where T : class, new();
		System.Linq.IQueryable<T> All<T>(int page, int pageSize) where T : class, new();
		void Add<T>(T item) where T : class, new();
		void Add<T>(IEnumerable<T> items) where T : class, new();
		IQueryable<T> Find<T>(Expression<Func<T, bool>> expression) where T : class, new();
	}
}
