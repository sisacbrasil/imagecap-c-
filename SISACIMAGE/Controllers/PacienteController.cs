using System;
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
    public class PacienteController : ControllerBase
    {
        private readonly Contexto _context;

        public PacienteController(Contexto context)
        {
            _context = context;
        }

        [HttpGet("{findPacienteByMovimento}")]
        public async Task<ActionResult<Paciente>> GetPaciente([FromQuery] string codMovimento,
            [FromQuery] string codExame,
            [FromQuery] string filial)
        {
            try
            {
                var paciente = await _context.Pacientes
                    .FromSqlRaw("" +
                                "SELECT " +
                                "ENT.FILIAL       AS Filial," +
                                "ENT.GRUPOEMP," +
                                "ENT.CODMOVIMENTO AS CodMovimento," +
                                "ENT.CODPACIENTE  AS CodPaciente," +
                                "ENT.DATAHORAENT  AS DataHoraEnt," +
                                "PAC.PACIENTE     AS NomePaciente," +
                                "PAC.SEXO         AS Sexo, " +
                                "PAC.DATANASC     AS DataNasc," +
                                "EX.IDEXAME       AS IDExame,     " +
                                "EX.CODAMB        AS CodigoProcedimento,  " +
                                "EX.DESCR         AS NomeProcedimento,  " +
                                "MED.CODMEDICO    AS CodigoMedico,     " +
                                "MED.NOME         AS MedicoExecutante" +
                                "    FROM ENTRADA AS ENT         " +
                                "    INNER JOIN CADPACIENTE AS PAC ON (PAC.CODPACIENTE = ENT.CODPACIENTE) " +
                                "    INNER JOIN EXAME AS EX ON (EX.CODPACIENTE = ENT.CODMOVIMENTO) AND EX.FILIAL = ENT.FILIAL " +
                                "    LEFT JOIN CADMEDICO AS MED ON (MED.CODMEDICO = EX.CODMEDICO) " +
                                "    AND MED.FILIAL IN ('99', EX.FILIAL)" +
                                "    WHERE ENT.FECHADO <> 'C'  AND ENT.LOTEENT <> 'INAT'  " +
                                "    AND LEFT(ISNULL(ENT.MOTIVO, ''), 6) <> 'ZERADO'  " +
                                "    AND EX.CODAMB IN (SELECT CODPROCEDIMENTO FROM EXAMELAUDO EL " +
                                "    WHERE EL.FILIAL IN ('99', EX.FILIAL))  AND ENT.CODMOVIMENTO = @codMovimento  " +
                                "    AND EX.IDEXAME = @codExame  " +
                                "    AND ENT.FILIAL = @filial",
                        new SqlParameter("@codMovimento", codMovimento),
                        new SqlParameter("@codExame", codExame),
                        new SqlParameter("@filial", filial)
                    ).ToListAsync();
                return Ok(paciente);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
    }
}