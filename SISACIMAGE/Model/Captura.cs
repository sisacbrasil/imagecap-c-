#nullable enable
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SISACIMAGE.Models
{
    [Table("IMAGEM_LAUDO")]
    public class Captura
    {
        [Key] [Column("ID_IMAGEM")] public int? IdImagem { get; set; }

        [Column("CODMOVIMENTO")] public string? CodMovimento { get; set; }

        [Column("CODPACIENTE")] public string? CodPaciente { get; set; }

        [Column("CODEXAME")] public string? CodExame { get; set; }

        [Column("NOME")] public string? Nome { get; set; }

        [Column("GRUPOEMP")] public string? GrupoEmp { get; set; }

        [Column("FILIAL")] public string? Filial { get; set; }

        [Column("NUMAUX")] public string? NumAux { get; set; }

        [Column("USUARIO")] public string? Usuario { get; set; }

        [Column("DATASIST")] public DateTime? DataSist { get; set; }

        [Column("IMAGEM")] public byte[]? Imagem { get; set; }

        [Column("ORDEM_IMAGEM")] public int OrdemImagem { get; set; }
    }
}