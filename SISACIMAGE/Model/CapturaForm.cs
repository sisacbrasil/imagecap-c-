#nullable enable
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SISACIMAGE.Model
{
    [Table("IMAGEM_LAUDO")]
    public class CapturaForm
    {
        [Column] public int Id { get; set; }

        [Column("CODMOVIMENTO")] public string? CodMovimento { get; set; }

        [Column("CODPACIENTE")] public string? CodPaciente { get; set; }

        [Column("CODEXAME")] public string? CodExame { get; set; }

        [Column("NOME")] public string? Nome { get; set; }

        [Column("GRUPOEMP")] public string? GrupoEmp { get; set; }

        [Column("FILIAL")] public string? Filial { get; set; }

        [Column("NUMAUX")] public int? NumAux { get; set; }

        [Column("USUARIO")] public string? Usuario { get; set; }

        [Column("DATASIST")] public DateTime? DataSist { get; set; }

        [Column("IMAGEM")] public string? Imagem { get; set; }

        public int? OrdemImagem { get; set; }
    }
}