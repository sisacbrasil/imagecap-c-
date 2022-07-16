#nullable enable
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SISACIMAGE.Model
{
    [Table("MIDIA_LAUDO")]
    public class CapturaVideo
    {
            [Key]
        [Column] public int Id { get; set; }
        [Column("IdExame")] public string? IdExame { get; set; }
        
        [Column("CODPACIENTE")] public string? CodPaciente { get; set; }

        [Column("CODMOVIMENTO")] public string? CodMovimento { get; set; }
        
        [Column("Tipo")] public string? Tipo { get; set; }
        [Column("Tamanho")] public string? Tamanho { get; set; }
        [Column("Extensao")] public string? Extensao { get; set; }
        [Column("Arquivo")] public byte[]? Arquivo { get; set; }
        [Column("DATASIST")] public DateTime? DataSist { get; set; }
        [Column("USUARIO")] public string? Usuario { get; set; }
        [Column("FILIAL")] public string? Filial { get; set; }
        [Column("GRUPOEMP")] public string? GrupoEmp { get; set; }
        [Column("NOME")] public string? Nome { get; set; }

        [Column("Laudo")] public bool? Laudo { get; set; }
        [Column("CodProcedimento")] public string? CodProcedimento { get; set; }
        [Column("DescricaoProcedimento")] public string? DescricaoProcedimento { get; set; }
        [Column("Enviado")] public string? Enviado { get; set; }
    }
}