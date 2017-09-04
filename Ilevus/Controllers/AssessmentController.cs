using ilevus.App_Start;
using ilevus.Attributes;
using ilevus.Models;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Resources;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace ilevus.Controllers
{
    [RoutePrefix("api/Assessments")]
    [IlevusAuthorization]
    public class AssessmentController : BaseAPIController
    {
        [HttpGet]
        [Route("GetAssessment/{id}")]
        public async Task<IHttpActionResult> GetAssessment(string Id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<AssessmentModel>.Filter;
            var collection = db.GeAssessmentsCollection();
            try
            {
                var result = await collection.FindAsync(filters.Eq("Id", Id));
                var notification = await result.FirstOrDefaultAsync();
                if (notification == null)
                {
                    return NotFound();
                }
                
                return Ok(notification);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpGet]
        [Route("GetReceivedAssessment/{id}")]
        public async Task<IHttpActionResult> GetReceivedAssessment(string Id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<AssessmentModel>.Filter;
            var collection = db.GeAssessmentsCollection();

            var collectionUser = db.GetUsersCollection();
            var filtersUsers = Builders<IlevusUser>.Filter;
            try
            {
                var result = await collection.FindAsync(filters.Eq("Avaliado", Id));
                var avaliacoes = await result.ToListAsync();                

                if (avaliacoes == null)
                {
                    return NotFound();
                }

                avaliacoes = await fillUsers(avaliacoes);
                avaliacoes = calculaMedia(avaliacoes);
                return Ok(avaliacoes);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        public static List<AssessmentModel> calculaMedia(List<AssessmentModel> avaliacoes)
        {
            try
            {
                var soma = avaliacoes.Sum(a => string.IsNullOrEmpty(a.Rating) ? 0 : Convert.ToInt32(a.Rating));
                int divisao = soma / avaliacoes.Count;

                foreach (var aval in avaliacoes)
                {
                    aval.MediaRating = divisao;
                }
            } catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return avaliacoes;
        }

        private async Task<List<AssessmentModel>> fillUsers(List<AssessmentModel> avaliacoes)
        {
            try
            {
                var db = IlevusDBContext.Create();
                var collectionUser = db.GetUsersCollection();
                var filtersUsers = Builders<IlevusUser>.Filter;

                foreach (var aval in avaliacoes)
                {
                    var resUsu = await collectionUser.FindAsync(filtersUsers.Eq("Id", aval.Avaliado));
                    var avaliado = resUsu.FirstOrDefaultAsync();
                    aval.DadosAvaliado = await avaliado;

                    var resUsu2 = await collectionUser.FindAsync(filtersUsers.Eq("Id", aval.Avaliador));
                    var avaliador = resUsu2.FirstOrDefaultAsync();
                    aval.DadosAvaliador = await avaliador;
                }
            } catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return avaliacoes;
        }

        [HttpGet]
        [Route("GetSendedAssessment/{id}")]
        public async Task<IHttpActionResult> GetSendedAssessment(string Id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<AssessmentModel>.Filter;
            var collection = db.GeAssessmentsCollection();

            var collectionUser = db.GetUsersCollection();
            var filtersUsers = Builders<IlevusUser>.Filter;
            try
            {
                var result = await collection.FindAsync(filters.Eq("Avaliador", Id));
                var avaliacoes = await result.ToListAsync();

                if (avaliacoes == null)
                {
                    return NotFound();
                }

                avaliacoes = await fillUsers(avaliacoes);
                avaliacoes = calculaMedia(avaliacoes);
                return Ok(avaliacoes);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }



    }
}