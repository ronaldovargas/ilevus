using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using ilevus.Models;
using Stripe;

//using Stripe;

namespace ilevus.Maps
{
	public class PaymentAccountProfile : Profile
	{
		public PaymentAccountProfile()
		{
			CreateMap<IlevusUser, AccountPayment>()
				.ForMember(para => para.Id, de => de.MapFrom(o => o.Id))
				.ForMember(para => para.Email, de => de.MapFrom(o => o.Email))
				.ForMember(para => para.FirstName, de => de.MapFrom(o => o.Name))
				.ForMember(para => para.LastName, de => de.MapFrom(o => o.Surname))
				.ForMember(para => para.Country, de => de.MapFrom(o => "BR"))
				.ForMember(para => para.DefaultCurrency, de => de.MapFrom(o => "brl"))
				.ForMember(para => para.PersonalIdNumber, de => de.MapFrom(o => o.Professional.TaxDocument))
				.ForMember(para => para.DateBirth, de => de.MapFrom(o => o.Birthdate));

			CreateMap<IlevusUser, Address>()
				.ForMember(para => para.City, de => de.MapFrom(o => o.Professional.City))
				.ForMember(para => para.Country, de => de.MapFrom(o => o.Professional.Country))
				.ForMember(para => para.State, de => de.MapFrom(o => o.Professional.County))
				.ForMember(para => para.PostalCode, de => de.MapFrom(o => o.Professional.Zipcode));

			CreateMap<StripeAccount, AccountPayment>()
				.ForMember(para => para.Id, de => de.MapFrom(o => o.Id))
				.ForMember(para => para.Email, de => de.MapFrom(o => o.Email));

			CreateMap<StripeCustomAccountKeys, CustomAccountKeys>()
				.ForMember(para => para.Publishable, de => de.MapFrom(o => o.Publishable))
				.ForMember(para => para.Secret, de => de.MapFrom(o => o.Secret));

			CreateMap<AccountPayment, StripeAccountLegalEntityOptions>()
				.ForMember(para => para.BirthDay, de => de.MapFrom(o => o.DateBirth.Day))
				.ForMember(para => para.BirthMonth, de => de.MapFrom(o => o.DateBirth.Month))
				.ForMember(para => para.BirthYear, de => de.MapFrom(o => o.DateBirth.Year))
				.ForMember(para => para.FirstName, de => de.MapFrom(o => o.FirstName))
				.ForMember(para => para.LastName, de => de.MapFrom(o => o.LastName))
				.ForMember(para => para.PersonalIdNumber, de => de.MapFrom(o => o.PersonalIdNumber))
				.ForMember(para => para.Type, de => de.MapFrom(o => "individual"))

				.ForMember(para => para.AddressCity, de => de.MapFrom(o => o.Address.City))
				.ForMember(para => para.AddressPostalCode, de => de.MapFrom(o => o.Address.PostalCode))
				.ForMember(para => para.AddressLine1, de => de.MapFrom(o => o.Address.Line1))
				.ForMember(para => para.AddressLine2, de => de.MapFrom(o => o.Address.Line2))
				.ForMember(para => para.AddressState, de => de.MapFrom(o => o.Address.State));


			CreateMap<Address, StripeAddress>()
				.ForMember(para => para.Country, de => de.MapFrom(o => o.Country))
				.ForMember(para => para.City, de => de.MapFrom(o => o.City))
				.ForMember(para => para.Line1, de => de.MapFrom(o => o.Line1))
				.ForMember(para => para.PostalCode, de => de.MapFrom(o => o.PostalCode))
				.ForMember(para => para.State, de => de.MapFrom(o => o.State));

			//CreateMap<IlevusUser, Person>()
			//	.ForMember(para => para.BirthDate, de => de.MapFrom(o => o.Birthdate.ToString("yyyy-MM-dd")))
			//	.ForMember(para => para.Name, de => de.MapFrom(o => o.Name))
			//	.ForMember(para => para.LastName, de => de.MapFrom(o => o.Surname))
			//	.ForMember(para => para.TaxDocument, de => de.MapFrom(o => new TaxDocument { Number = o.Professional.Financial.TaxDocument }))
			//	.ForMember(para => para.Address, de => de.MapFrom(o => Mapper.Map<IlevusUser, Address>(o)))
			//	.ForMember(para => para.Phone, de => de.MapFrom(o => Mapper.Map<UserProfessionalEntity, Phone>(o.Professional)))
			//	.ForMember(para => para.IdentityDocument, de => de.MapFrom(o => Mapper.Map<IdentityDocumentModel, IdentityDocument>(o.Professional.Financial.IdentityDocument)));


			//CreateMap<UserProfessionalEntity, Phone>()
			//	.ForMember(para => para.Number, de => de.MapFrom(o => o.Phone.Number))
			//	.ForMember(para => para.AreaCode, de => de.MapFrom(o => o.Phone.AreaCode))
			//	.ForMember(para => para.CountryCode, de => de.MapFrom(o => o.Phone.CountryCode));


			//CreateMap<IdentityDocumentModel, IdentityDocument>()
			//	.ForMember(para => para.Number, de => de.MapFrom(o => o.Number))
			//	.ForMember(para => para.IssueDate, de => de.MapFrom(o => o.IssueDate))
			//	.ForMember(para => para.Issuer, de => de.MapFrom(o => o.Issuer));
		}

	}
}