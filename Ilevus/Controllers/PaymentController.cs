using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ilevus.App_Start;
using ilevus.Repository;
using Microsoft.AspNet.Identity;

namespace ilevus.Controllers
{
	using System.Collections;

	using ilevus.Models;

	public class PaymentController : BaseAPIController
	{
		public IEnumerable Get()
		{
			IlevusDBContext repository = IlevusDBContext.Create();
			//User.Identity.Name
			IlevusUser user = UserManager.FindByName(User.Identity.Name);
			if (user.AccountCustumer == null)
			{
				return null;
			}

			var lista = MongoContext.Current.Find<PaymentsCustomer>(x => x.Customer.Id == user.AccountCustumer.Id);

			return lista.ToList();
		}
	}
}
