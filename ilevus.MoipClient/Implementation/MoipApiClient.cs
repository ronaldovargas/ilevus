using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using ilevus.MoipClient.Exceptions;
using ilevus.MoipClient.Models;
using Newtonsoft.Json;
using RestSharp;
using RestSharp.Authenticators;

namespace ilevus.MoipClient.Implementation
{
	public partial class MoipApiClient
	{
		readonly IRestClient _httpClient;
		private readonly HttpBasicAuthenticator _httpBasicAuthenticator;
		const string API_APP_TOKEN = "MoipApiAppToken";

		public MoipApiClient(string AccessToken = null, IRestClient httpClient = default(IRestClient), string baseUrl = "https://sandbox.moip.com.br/v2")
		{
			var apiAppToken = AccessToken == null ? ConfigurationManager.AppSettings.Get(API_APP_TOKEN) : AccessToken;

			if (string.IsNullOrWhiteSpace(apiAppToken))
				throw new ConfigurationErrorsException("O Token de acesso do app não está configurado no App.config ou Web.config, tente criar o app antes.");

			_httpClient = httpClient ?? new RestClient(new Uri(baseUrl));
			_httpClient.AddHandler("application/json", NewtonsoftJsonSerializer.Instance);

			_httpClient.AddDefaultHeader("Authorization", "OAuth " + apiAppToken);
		}

		private IRestRequest CreateRequest(string resource, Method method)
		{
			var request = new RestRequest(resource, method);
			request.JsonSerializer = NewtonsoftJsonSerializer.Instance;
			return request;
		}

		private async Task<T> Get<T>(string id, string url)
			=> (await ExecuteTaskAsync<T>(CreateRequest(url, Method.GET).AddUrlSegment("id", id))).Data;

		private async Task<T> Post<T>(T client, string url)
		{
			var request = CreateRequest(url, Method.POST).AddJsonBody(client);
			IRestResponse<T> restResponse = await ExecuteTaskAsync<T>(request);
			return restResponse.Data;
		}

		private async Task<T> Post<T>(string id, string url)
			=> (await ExecuteTaskAsync<T>(CreateRequest(url, Method.POST).AddUrlSegment("id", id))).Data;

		private async Task<T> Post<T>(T client, IDictionary<string, string> segments, string url)
		{
			var request = CreateRequestWithParametersAndData(client, segments, url, Method.POST);
			return (await ExecuteTaskAsync<T>(request)).Data;
		}

		private async Task<T> Put<T>(T client, string id, string url)
			=> (await ExecuteTaskAsync<T>(CreateRequest(url, Method.PUT).AddUrlSegment("id", id).AddJsonBody(client))).Data;

		private async Task<T> Put<T>(string id, string url)
			=> (await ExecuteTaskAsync<T>(CreateRequest(url, Method.PUT).AddUrlSegment("id", id))).Data;

		private async Task<T> Put<T>(T client, IDictionary<string, string> segments, string url)
		{
			var request = CreateRequestWithParametersAndData(client, segments, url, Method.PUT);
			return (await ExecuteTaskAsync<T>(request)).Data;
		}

		private async Task<T> Delete<T>(string id, string url)
			=> (await ExecuteTaskAsync<T>(CreateRequest(url, Method.DELETE).AddUrlSegment("id", id))).Data;

		private T GetSync<T>(string id, string url)
		{
			var request = CreateRequest(url, Method.GET).AddUrlSegment("id", id);
			var response = ExecuteRequest<T>(request);
			return response;
		}

		private T PostSync<T>(T client, string url)
		{
			var request = CreateRequest(url, Method.POST).AddJsonBody(client);
			return ExecuteRequest<T>(request);
		}

		private T PostSync<T>(string id, string url)
		{
			var request = CreateRequest(url, Method.POST).AddUrlSegment("id", id);
			var restResponse = _httpClient.Execute(request);
			return NewtonsoftJsonSerializer.Instance.Deserialize<T>(restResponse);
		}

		private T PostSync<T>(T client, IDictionary<string, string> segments, string url)
		{
			var request = CreateRequestWithParametersAndData(client, segments, url, Method.POST);
			var restResponse = _httpClient.Execute(request);
			return NewtonsoftJsonSerializer.Instance.Deserialize<T>(restResponse);
		}

		private T PutSync<T>(T client, string id, string url)
		{
			var request = CreateRequest(url, Method.PUT).AddUrlSegment("id", id).AddJsonBody(client);
			var restResponse = _httpClient.Execute(request);
			return NewtonsoftJsonSerializer.Instance.Deserialize<T>(restResponse);
		}

		private T PutSync<T>(string id, string url)
		{
			var request = CreateRequest(url, Method.PUT).AddUrlSegment("id", id);
			var restResponse = _httpClient.Execute(request);
			return NewtonsoftJsonSerializer.Instance.Deserialize<T>(restResponse);
		}

		private T PutSync<T>(T client, IDictionary<string, string> segments, string url)
		{
			var request = CreateRequestWithParametersAndData(client, segments, url, Method.PUT);
			var restResponse = _httpClient.Execute(request);
			return NewtonsoftJsonSerializer.Instance.Deserialize<T>(restResponse);
		}

		private T DeleteSync<T>(string id, string url)
		{
			var request = CreateRequest(url, Method.DELETE).AddUrlSegment("id", id);
			var restResponse = _httpClient.Execute(request);
			return NewtonsoftJsonSerializer.Instance.Deserialize<T>(restResponse);
		}

		private T ExecuteRequest<T>(IRestRequest request)
		{
			var response = _httpClient.Execute(request);

			if (response.StatusCode == HttpStatusCode.OK)
				return NewtonsoftJsonSerializer.Instance.Deserialize<T>(response);

			if (response.StatusCode == HttpStatusCode.Unauthorized)
				throw new MoipUnauthorizedException();

			throw response.ErrorException;
		}

		private async Task<IRestResponse<T>> ExecuteTaskAsync<T>(IRestRequest request)
		{
			IRestResponse<T> response = await _httpClient.ExecuteTaskAsync<T>(request);

			if (response.StatusCode == HttpStatusCode.Created)
				return response;

			if (response.StatusCode == HttpStatusCode.Unauthorized)
				throw new MoipUnauthorizedException();

			if (response.StatusCode == HttpStatusCode.BadRequest)
			{
				var errors = GetFirstInstance<IList<Error>>("errors", response.Content);
				var additionalInfo = GetFirstInstance<T>("account", response.Content);
				if (additionalInfo != null)
				{
					response.Data = additionalInfo;
					return response;
				}
				throw new MoipErrorException(errors);
			}

			throw response.ErrorException;
		}


		private IRestRequest CreateRequestWithParametersAndData<T>(T data, IDictionary<string, string> segments,
			string url, Method method)
		{
			var request = CreateRequest(url, method).AddJsonBody(data);

			foreach (var segment in segments)
				request.AddUrlSegment(segment.Key, segment.Value);

			return request;
		}

		public T GetFirstInstance<T>(string propertyName, string json)
		{
			try
			{
				using (var stringReader = new StringReader(json))
				using (var jsonReader = new JsonTextReader(stringReader))
				{
					while (jsonReader.Read())
					{
						if (jsonReader.TokenType == JsonToken.PropertyName
							&& (string)jsonReader.Value == propertyName)
						{
							jsonReader.Read();
							var serializer = new JsonSerializer
							{
								NullValueHandling = NullValueHandling.Ignore
							};
							return serializer.Deserialize<T>(jsonReader);
						}
					}
					return default(T);
				}
			}
			catch (Exception e)
			{

				throw e;
			}
		}

	}
}