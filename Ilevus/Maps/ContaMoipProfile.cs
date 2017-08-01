using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using ilevus.Models;
using ilevus.MoipClient.Models;

namespace ilevus.Maps
{
	public class ContaMoipProfile : Profile
	{
		public ContaMoipProfile()
		{
			CreateMap<IlevusUser, ContaMoip>()
				.ForMember(para => para.Email, de => de.MapFrom(o => new Email( o.Email)))
				.ForMember(para => para.Login, de => de.MapFrom(o => o.Email))
				.ForMember(para => para.Person, f => f.MapFrom(de => Mapper.Map<IlevusUser, Person>(de)));


			CreateMap<IlevusUser, Address>()
				.ForMember(para => para.City, de => de.MapFrom(o => o.Professional.City))
				.ForMember(para => para.Country, de => de.MapFrom(o => o.Professional.Country))
				.ForMember(para => para.District, de => de.MapFrom(o => o.Professional.District))
				.ForMember(para => para.Street, de => de.MapFrom(o => o.Professional.Address))
				.ForMember(para => para.State, de => de.MapFrom(o => o.Professional.County))
				.ForMember(para => para.StreetNumber, de => de.MapFrom(o => o.Professional.StreetNumber))
				.ForMember(para => para.ZipCode, de => de.MapFrom(o => o.Professional.Zipcode));



			CreateMap<IlevusUser, Person>()
				.ForMember(para => para.BirthDate, de => de.MapFrom(o => o.Birthdate.ToString("yyyy-MM-dd")))
				.ForMember(para => para.Name, de => de.MapFrom(o => o.Name))
				.ForMember(para => para.LastName, de => de.MapFrom(o => o.Surname))
				.ForMember(para => para.TaxDocument, de => de.MapFrom(o => new TaxDocument { Number = o.Professional.Financial.TaxDocument }))
				.ForMember(para => para.Address, de => de.MapFrom(o => Mapper.Map<IlevusUser, Address>(o)))
				.ForMember(para => para.Phone, de => de.MapFrom(o => Mapper.Map<UserProfessionalProfile, Phone>(o.Professional)))
				.ForMember(para => para.IdentityDocument, de => de.MapFrom(o => Mapper.Map<IdentityDocumentModel, IdentityDocument>(o.Professional.Financial.IdentityDocument)));


			CreateMap<UserProfessionalProfile, Phone>()
				.ForMember(para => para.Number, de => de.MapFrom(o => o.Phone.Number))
				.ForMember(para => para.AreaCode, de => de.MapFrom(o => o.Phone.AreaCode))
				.ForMember(para => para.CountryCode, de => de.MapFrom(o => o.Phone.CountryCode));


			CreateMap<IdentityDocumentModel, IdentityDocument>()
				.ForMember(para => para.Number, de => de.MapFrom(o => o.Number))
				.ForMember(para => para.IssueDate, de => de.MapFrom(o => o.IssueDate))
				.ForMember(para => para.Issuer, de => de.MapFrom(o => o.Issuer));
		}

	}
}