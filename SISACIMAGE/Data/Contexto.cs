using Microsoft.EntityFrameworkCore;
using SISACIMAGE.Model;
using SISACIMAGE.Models;

namespace SISACIMAGE.Config
{
    public sealed class Contexto : DbContext
    {
        public Contexto(DbContextOptions<Contexto> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Entrada> Entradas { get; set; }
        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<ModeloLaudo> Modelos { get; set; }
        public DbSet<SecaoLaudo> Secoes { get; set; }
        public DbSet<FormTopico> Topicos { get; set; }
    }
}