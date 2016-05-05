﻿using ilevus.Helpers;
using Newtonsoft.Json.Linq;
using System.Collections;
using System.Resources;
using System.Threading;
using System.Web.Http;

namespace ilevus.Controllers
{
    public class MessagesController : BaseAPIController
    {
        // GET /api/Messages
        public IHttpActionResult Get()
        {
            JObject resourceObject = new JObject();
            
            ResourceSet resourceSet = Messages.ResourceManager.GetResourceSet(Thread.CurrentThread.CurrentCulture, true, true);
            IDictionaryEnumerator enumerator = resourceSet.GetEnumerator();
            while (enumerator.MoveNext())
            {
                resourceObject.Add(enumerator.Key.ToString(), enumerator.Value.ToString());
            }

            return Ok(resourceObject);
        }
    }
}