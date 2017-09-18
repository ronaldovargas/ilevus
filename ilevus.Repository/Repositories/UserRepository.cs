using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ilevus.Models;
using MongoRepository;

namespace ilevus.Repository.Repositories
{
	public class UserRepository : MongoRepository<IlevusUser>
	{
	}
}
