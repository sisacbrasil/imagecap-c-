using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SISACIMAGE.Model
{
    [Table("CADPACIENTE")]
    public class Paciente
    {
        [Column("IDExame")] public int Id { get; set; }

        public string Filial { get; set; }
        public string CodMovimento { get; set; }
        public string CodPaciente { get; set; }
        public DateTime DataHoraEnt { get; set; }
        public string NomePaciente { get; set; }
        public string Sexo { get; set; }
        public DateTime DataNasc { get; set; }
        public string CodigoProcedimento { get; set; }
        public string NomeProcedimento { get; set; }
        public string CodigoMedico { get; set; }
        public string MedicoExecutante { get; set; }
    }
}