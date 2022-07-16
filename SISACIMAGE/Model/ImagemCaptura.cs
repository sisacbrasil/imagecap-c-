using System.ComponentModel.DataAnnotations.Schema;

namespace SISACIMAGE.Models
{
    [Table("IMAGENS")]
    public class ImagemCaptura
    {
        [Column("Id")] public int Id { get; set; }

        [Column("IMAGE")] public string IMAGE { get; set; }

        [Column("NOME")] public string NOME { get; set; }

        [Column("ORDEM_IMAGEM")] public string ORDEM_IMAGEM { get; set; }

        [ForeignKey("CapturaId")] public int CapturaId { get; set; }

        public Captura captura { get; set; }
    }
}