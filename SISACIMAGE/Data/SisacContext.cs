using Microsoft.EntityFrameworkCore;
using SISACIMAGE.Model;
using SISACIMAGE.Models;

namespace SISACIMAGE.Data
{
    public sealed class SisacContext : DbContext
    {
        public SisacContext(DbContextOptions<SisacContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Captura> Capturas { get; set; }
        public DbSet<CapturaVideo> CapturaVideo { get; set; }

        public DbSet<ImagemCaptura> ImagemCaptura { get; set; }
    }
}