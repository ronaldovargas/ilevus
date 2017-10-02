﻿using System.Threading.Tasks;
using ilevus.MoipClient.Models;
using RestSharp;
using HtmlAgilityPack;
using System.Net;
using System.Collections.Generic;
using System.Text;

namespace ilevus.MoipClient.Implementation
{
	public partial class MoipApiClient
	{

		public async Task<ContaMoip> CriarContaMoip(ContaMoip conta) => await Post<ContaMoip>(conta, "/accounts");

		public async Task<ContaMoip> ConsultarContaMoip(string contaId) => await Get<ContaMoip>(contaId, "/accounts/{id}");
		public async Task<ContaBancaria> CriarContaBancaria(ContaBancaria contaBancaria) => await Post<ContaBancaria>(contaBancaria, $"/accounts/{contaBancaria.AccountId}/bankaccounts");


		public void Get(string client_id, string url)
		{

			RestClient client = new RestClient("https://connect-sandbox.moip.com.br/");
			RestRequest request = new RestRequest("/oauth/authorize", Method.GET);
			request.AddParameter("response_type", "code", ParameterType.QueryString);
			request.AddParameter("client_id", client_id, ParameterType.QueryString);
			request.AddParameter("redirect_uri", url, ParameterType.QueryString);
			request.AddParameter("scope", "RECEIVE_FUNDS", ParameterType.QueryString);

			IRestResponse response = client.Execute(request);

			var fullUrl = client.BuildUri(request);
		}
		public string CriarSenha(ContaMoip conta)
		{
			//var web = new HtmlWeb();
			//var doc = web.Load(conta.Links.SetPassword.Href);

			BrowserSession b = new BrowserSession();
			b.Get(conta.Links.SetPassword.Href);
			b.FormElements["newpassword"] = "@Darliane23";
			b.FormElements["confirmpassword"] = "@Darliane23";
			return  b.Post("https://desenvolvedor.moip.com.br/sandbox/AskForNewPassword.do?method=trocaSenha");

		}

		public string LogarViaHtml(string login,string url)
		{
			//var web = new HtmlWeb();
			//var doc = web.Load(conta.Links.SetPassword.Href);

			BrowserSession b = new BrowserSession();
			b.Get(url);
			 b.FormElements["login"] = login;
			b.FormElements["password"] = "@Darliane23";
			var t = b.Post("https://connect-sandbox.moip.com.br/login");

			b.Get(url);
			var e = b.Post("https://connect-sandbox.moip.com.br/oauth/authorize");
			return e;
		}

		public string AutorizarUso(string url)
		{
			//var web = new HtmlWeb();
			//var doc = web.Load(conta.Links.SetPassword.Href);

			BrowserSession b = new BrowserSession();
			b.Get(url);
			return b.Post("https://connect-sandbox.moip.com.br/oauth/authorize");

		}
	}

	public class BrowserSession
	{
		private bool _isPost;
		private HtmlDocument _htmlDoc;

		/// <summary>
		/// System.Net.CookieCollection. Provides a collection container for instances of Cookie class 
		/// </summary>
		public CookieCollection Cookies { get; set; }

		/// <summary>
		/// Provide a key-value-pair collection of form elements 
		/// </summary>
		public FormElementCollection FormElements { get; set; }

		/// <summary>
		/// Makes a HTTP GET request to the given URL
		/// </summary>
		public string Get(string url)
		{
			_isPost = false;
			CreateWebRequestObject().Load(url);
			return _htmlDoc.DocumentNode.InnerHtml;
		}

		/// <summary>
		/// Makes a HTTP POST request to the given URL
		/// </summary>
		public string Post(string url)
		{
			_isPost = true;
			CreateWebRequestObject().Load(url, "POST");
			return _htmlDoc.DocumentNode.InnerHtml;
		}

		/// <summary>
		/// Creates the HtmlWeb object and initializes all event handlers. 
		/// </summary>
		private HtmlWeb CreateWebRequestObject()
		{
			HtmlWeb web = new HtmlWeb();
			web.UseCookies = true;
			web.PreRequest = new HtmlWeb.PreRequestHandler(OnPreRequest);
			web.PostResponse = new HtmlWeb.PostResponseHandler(OnAfterResponse);
			web.PreHandleDocument = new HtmlWeb.PreHandleDocumentHandler(OnPreHandleDocument);
			return web;
		}

		/// <summary>
		/// Event handler for HtmlWeb.PreRequestHandler. Occurs before an HTTP request is executed.
		/// </summary>
		protected bool OnPreRequest(HttpWebRequest request)
		{
			AddCookiesTo(request);               // Add cookies that were saved from previous requests
			if (_isPost) AddPostDataTo(request); // We only need to add post data on a POST request
			return true;
		}

		/// <summary>
		/// Event handler for HtmlWeb.PostResponseHandler. Occurs after a HTTP response is received
		/// </summary>
		protected void OnAfterResponse(HttpWebRequest request, HttpWebResponse response)
		{
			SaveCookiesFrom(response); // Save cookies for subsequent requests
		}

		/// <summary>
		/// Event handler for HtmlWeb.PreHandleDocumentHandler. Occurs before a HTML document is handled
		/// </summary>
		protected void OnPreHandleDocument(HtmlDocument document)
		{
			SaveHtmlDocument(document);
		}

		/// <summary>
		/// Assembles the Post data and attaches to the request object
		/// </summary>
		private void AddPostDataTo(HttpWebRequest request)
		{
			string payload = FormElements.AssemblePostPayload();
			byte[] buff = Encoding.UTF8.GetBytes(payload.ToCharArray());
			request.ContentLength = buff.Length;
			request.ContentType = "application/x-www-form-urlencoded";
			System.IO.Stream reqStream = request.GetRequestStream();
			reqStream.Write(buff, 0, buff.Length);
		}

		/// <summary>
		/// Add cookies to the request object
		/// </summary>
		private void AddCookiesTo(HttpWebRequest request)
		{
			if (Cookies != null && Cookies.Count > 0)
			{
				request.CookieContainer.Add(Cookies);
			}
		}

		/// <summary>
		/// Saves cookies from the response object to the local CookieCollection object
		/// </summary>
		private void SaveCookiesFrom(HttpWebResponse response)
		{
			if (response.Cookies.Count > 0)
			{
				if (Cookies == null) Cookies = new CookieCollection();
				Cookies.Add(response.Cookies);
			}
		}

		/// <summary>
		/// Saves the form elements collection by parsing the HTML document
		/// </summary>
		private void SaveHtmlDocument(HtmlDocument document)
		{
			_htmlDoc = document;
			FormElements = new FormElementCollection(_htmlDoc);
		}
	}

	/// <summary>
	/// Represents a combined list and collection of Form Elements.
	/// </summary>
	public class FormElementCollection : Dictionary<string, string>
	{
		/// <summary>
		/// Constructor. Parses the HtmlDocument to get all form input elements. 
		/// </summary>
		public FormElementCollection(HtmlDocument htmlDoc)
		{
			var inputs = htmlDoc.DocumentNode.Descendants("input");
			foreach (var element in inputs)
			{
				string name = element.GetAttributeValue("name", "undefined");
				string value = element.GetAttributeValue("value", "");
				if (!name.Equals("undefined")) Add(name, value);
			}
		}

		/// <summary>
		/// Assembles all form elements and values to POST. Also html encodes the values.  
		/// </summary>
		public string AssemblePostPayload()
		{
			StringBuilder sb = new StringBuilder();
			foreach (var element in this)
			{
				string value = System.Web.HttpUtility.UrlEncode(element.Value);
				sb.Append("&" + element.Key + "=" + value);
			}
			return sb.ToString().Substring(1);
		}
	}
}
