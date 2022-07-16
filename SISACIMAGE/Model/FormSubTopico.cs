#nullable enable
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SISACIMAGE.Model
{
    [Table("SUBTOPICOS_CAPTURA")]
    public class FormSubTopico
    {
        [Key] [Column] public int Id { get; set; }

        [Column] public string? Nome { get; set; }

        [Column] public string? Tipo { get; set; }

        [Column] public string? Conteudo { get; set; }

        [Column] public string? Usuario { get; set; }

        [Column] public DateTime DataCriacao { get; set; }
    }
}