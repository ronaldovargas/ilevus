using System;
using System.Linq;

namespace ilevus.Models
{
	public class PhoneModel
	{
		public string CountryCode { get; } = "55";

		private string areaCode;
		public string AreaCode
		{
			get { return areaCode; }
			set {
				try
				{
					areaCode = new string(value.Where(c => char.IsDigit(c)).ToArray());
				} catch (Exception ex)
				{
					Console.WriteLine(ex.Message);
					areaCode = string.Empty;
				}
			}
		}

		public string Number { get; set; }
	}
}