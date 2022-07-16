using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SISACIMAGE.Config;
using SISACIMAGE.Model;

namespace SISACIMAGE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModelosController : ControllerBase
    {
        private readonly Contexto _context;

        public ModelosController(Contexto context)
        {
            _context = context;
        }

        [HttpGet()]
        public async Task<ActionResult<ModeloLaudo>> ListarModelos()
        {
            try
            {
                var data = await _context.Modelos.FromSqlRaw(" SELECT * FROM MODELO_LAUDO_CAPTURA").ToListAsync();
                return Ok(data);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }

        [HttpPost()]
        public async Task<ActionResult<ModeloLaudo>> GravarModelo([FromBody] ModeloLaudo modelo)
        {
            try
            {
                var data = new ModeloLaudo
                {
                    Nome = modelo.Nome,
                    DataCriacao = DateTime.Now
                };

                _context.Modelos.Add(data);
                await _context.SaveChangesAsync();
                return Ok( new { message = "Modelo gravado com sucesso!", sucess = true});
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }

        [HttpPost("Secao")]
        public async Task<ActionResult<SecaoLaudo>> GravarSecao([FromBody] SecaoLaudo modelo)
        {
            try
            {
                var data = new SecaoLaudo
                {
                    SECAO = modelo.SECAO,
                    MODELO_LAUDO_ID = modelo.MODELO_LAUDO_ID,
                    DataCriacao = DateTime.Now
                };

                _context.Secoes.Add(data);
                await _context.SaveChangesAsync();
                return Ok( new { message = "Modelo gravado com sucesso!", sucess = true});
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }
        
        [HttpGet("Secao")]
        public async Task<ActionResult<SecaoLaudo>> ListarSecoes()
        {
            try
            {
                var data = await _context.Secoes.FromSqlRaw(" SELECT * FROM MODELO_LAUDO_CAPTURA_SECOES").ToListAsync();
                return Ok(data);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }
        
        [HttpGet("Secao/{id}")]
        public async Task<ActionResult<SecaoLaudo>> ListarSecoes(int id)
        {
            try
            {
                var data = await _context.Secoes.FromSqlRaw(" SELECT * FROM MODELO_LAUDO_CAPTURA_SECOES where MODELO_LAUDO_ID = @modeloId", 
                    new SqlParameter("@modeloId", id)).ToListAsync();
                return Ok(data);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }
        
        [HttpPost("Topico")]
        public async Task<ActionResult<FormTopico>> GravarTopico([FromBody] FormTopico topico)
        {
            try
            {
                var data = new FormTopico
                {
                    Nome = topico.Nome,
                    Tipo = topico.Tipo,
                    Conteudo = topico.Conteudo,
                    DataCriacao = DateTime.Now
                };

                _context.Topicos.Add(data);
                await _context.SaveChangesAsync();
                return Ok("Tópico gravado com sucesso!");
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }

        [HttpDelete("Topico/{id}")]
        public async Task<ActionResult<FormTopico>> DeleteStudent(int id)
        {
            var data = await _context.Topicos.FindAsync(id);
            if (data == null) return NotFound();
            _context.Topicos.Remove(data);
            await _context.SaveChangesAsync();

            return Ok(data);
        }
        
        [HttpGet("SubTopico")]
        public async Task<ActionResult<ModeloLaudo>> ListarSubTopicos()
        {
            try
            {
                var data = await _context.Modelos.FromSqlRaw(" SELECT * FROM SUBTOPICOS_CAPTURA").ToListAsync();
                return Ok(data);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }

        [HttpPost("SubTopico")]
        public async Task<ActionResult<FormTopico>> GravarSubTopico([FromBody] FormTopico topico)
        {
            try
            {
                var data = new FormTopico
                {
                    Nome = topico.Nome,
                    Tipo = topico.Tipo,
                    Conteudo = topico.Conteudo,
                    DataCriacao = DateTime.Now
                };

                _context.Topicos.Add(data);
                await _context.SaveChangesAsync();
                return Ok("SubTópico gravado com sucesso!");
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }
    }
}