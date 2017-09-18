using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Web;
using AutoMapper;
using ilevus.Models;
using MongoDB.Driver;
using Stripe;

namespace ilevus.Controllers
{
	public static class PriceManager
	{
		public static double FinalPrice(UserService service)
		{
			var percMoip = service.Price * 0.0549;
			var percImpMoip = percMoip * 0.15;
			var mktDir = 29.90;
			var comIle = 1.15;

			return Math.Round((percMoip + percImpMoip + mktDir + comIle + service.Price * 1), 2);
		}
	}
}
