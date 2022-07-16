using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SISACIMAGE.Data;
using SISACIMAGE.Model;
using SISACIMAGE.Models;

namespace SISACIMAGE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CapturaController : ControllerBase
    {
        private readonly SisacContext _context;

        public CapturaController(SisacContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Captura>> PostCaptura([FromBody] CapturaForm captura)
        {
            try
            {
                var bytes = Convert.FromBase64String(captura.Imagem ?? string.Empty);
                var cap = new Captura
                {
                    CodMovimento = captura.CodMovimento,
                    CodPaciente = captura.CodPaciente,
                    CodExame = captura.CodExame,
                    Nome = captura.Nome,
                    GrupoEmp = captura.GrupoEmp,
                    Filial = captura.Filial,
                    NumAux = "01",
                    Usuario = captura.Usuario,
                    DataSist = DateTime.Now,
                    Imagem = bytes
                };
                if (captura.OrdemImagem != null) cap.OrdemImagem = (int)captura.OrdemImagem;
                _context.Capturas.Add(cap);
                await _context.SaveChangesAsync();
                return Ok("Captura gravada com sucesso!");
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }
        
        [HttpPost("Video")]
        public async Task<ActionResult<CapturaVideo>> GravarVideo([FromBody] CapturaVideoForm captura)
        {
            try
            {
                var bytes = Convert.FromBase64String(captura.Arquivo);
                var cap = new CapturaVideo
                {
                    IdExame = captura.IdExame,
                    CodPaciente = captura.CodPaciente,
                    CodMovimento = captura.CodMovimento,
                    Tipo = captura.Tipo,
                    Tamanho = captura.Tamanho,
                    Extensao = captura.Extensao,
                    Arquivo = bytes,
                    DataSist = DateTime.Now,
                    Usuario = captura.Usuario,
                    Filial = captura.Filial,
                    GrupoEmp = captura.GrupoEmp,
                    Nome = captura.Nome,
                    Laudo = captura.Laudo,
                    CodProcedimento = captura.CodProcedimento,
                    DescricaoProcedimento = captura.DescricaoProcedimento,
                    Enviado = captura.Enviado,
                    
                };
                _context.CapturaVideo.Add(cap);
                await _context.SaveChangesAsync();
                return Ok("Video gravado com sucesso!");
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }
        

        [HttpGet("{findByPaciente}")]
        public async Task<ActionResult<Captura>> ListarImagensCapturadasPorPaciente([FromQuery] string codPaciente,
            [FromQuery] string codMovimento)
        {
            try
            {
                var data = await _context.Capturas.FromSqlRaw(" SELECT * FROM IMAGEM_LAUDO " +
                                                              " WHERE CODPACIENTE = @codPaciente" +
                                                              " AND CODMOVIMENTO = @codMovimento",
                    new SqlParameter("@codPaciente", codPaciente),
                    new SqlParameter("@codMovimento", codMovimento)).ToListAsync();
                return Ok(data);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }
        
        
        [HttpGet("Videos/{findByPaciente}")]
        public async Task<ActionResult<Captura>> ListarVideosPorPaciente([FromQuery] string codPaciente,
            [FromQuery] string codMovimento)
        {
            try
            {
                var data = await _context.CapturaVideo.FromSqlRaw(" SELECT * FROM MIDIA_LAUDO " +
                                                              " WHERE CODPACIENTE = @codPaciente" +
                                                              " AND CODMOVIMENTO = @codMovimento " +
                                                              " AND TIPO = 'VIDEO'",
                    new SqlParameter("@codPaciente", codPaciente),
                    new SqlParameter("@codMovimento", codMovimento)).ToListAsync();
                return Ok(data);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Captura>> DeleteStudent(int id)
        {
            var data = await _context.Capturas.FindAsync(id);
            if (data == null) return NotFound();
            _context.Capturas.Remove(data);
            await _context.SaveChangesAsync();

            return Ok(data);
        }
    }
}