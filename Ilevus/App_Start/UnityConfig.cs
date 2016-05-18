using ilevus.Helpers;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ilevus
{
    /**
     * <summary>
     * Esta classe configura o IoC Container (Unity) para injetar os objetos necessários à aplicação.
     * </summary>
     * <see cref="http://www.asp.net/web-api/overview/advanced/dependency-injection"/>
     */
    public class UnityConfig
    {
        public static void Register(HttpConfiguration config)
        {
            var container = new UnityContainer();
            
            // Registra-se implementações para as dependências que precisam ser injetadas.
            //container.RegisterType<IProductRepository, ProductRepository>(new HierarchicalLifetimeManager());

            config.DependencyResolver = new UnityResolver(container);
        }
    }
}