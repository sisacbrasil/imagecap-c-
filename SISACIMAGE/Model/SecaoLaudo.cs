#nullable enable
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SISACIMAGE.Model
{
    [Table("MODELO_LAUDO_CAPTURA_SECOES")]
    public class SecaoLaudo
    {
        [Key] [Column] public int Id { get; set; }

        [Column] public string? SECAO { get; set; }
        
        [Column] public int? MODELO_LAUDO_ID { get; set; }

        [Column] public DateTime DataCriacao { get; set; }
    }
}