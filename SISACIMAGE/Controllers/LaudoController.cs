using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SISACIMAGE.Config;
using SISACIMAGE.Model;

namespace SISACIMAGE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LaudoController : ControllerBase
    {
        private readonly Contexto _context;

        public LaudoController(Contexto context)
        {
            _context = context;
        }

        [HttpGet("Modelo")]
        public async Task<ActionResult<ModeloLaudo>> ListarModelos()
        {
            try
            {
                var data = await _context.Modelos.FromSqlRaw(" SELECT * FROM MODELO_LAUDO").ToListAsync();
                return Ok(data);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }

        [HttpPost("Modelo")]
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
                return Ok("Modelo gravado com sucesso!");
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message, success = false });
            }
        }


        [HttpGet("Topico")]
        public async Task<ActionResult<ModeloLaudo>> ListarTopicos()
        {
            try
            {
                var data = await _context.Modelos.FromSqlRaw(" SELECT * FROM TOPICOS_CAPTURA").ToListAsync();
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

        [HttpGet("arquivo")]
        public async Task GravarLaudoNoArquivo()
        {
            // Set a variable to the Documents path.
            var docPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);

            // Write the specified text asynchronously to a new file named "WriteTextAsync.txt".
            using (var outputFile = new StreamWriter(Path.Combine(docPath, "WriteTextAsync.txt")))
            {
                await outputFile.WriteAsync("This is a sentence.");
            }
        }
    }
}