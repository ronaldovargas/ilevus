using AutoMapper;
using ilevus.Maps;
using ilevus.Models;

public class AutoMapperConfig
{
	public static void Initialize()
	{
		Mapper.Initialize((config) =>
		{
			config.AddProfile<PaymentAccountProfile>();
		});
	}
}