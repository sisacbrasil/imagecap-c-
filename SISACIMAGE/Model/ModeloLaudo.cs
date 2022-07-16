#nullable enable
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SISACIMAGE.Model
{
    [Table("MODELO_LAUDO_CAPTURA")]
    public class ModeloLaudo
    {
        [Key] [Column] public int Id { get; set; }

        [Column] public string? Nome { get; set; }

        [Column] public DateTime DataCriacao { get; set; }
    }
}