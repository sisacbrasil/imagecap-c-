#nullable enable
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SISACIMAGE.Config;
using SISACIMAGE.Models;

namespace SISACIMAGE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntradasController : ControllerBase
    {
        private readonly Contexto _context;

        public EntradasController(Contexto context)
        {
            _context = context;
        }


        [HttpGet("{findByDate}")]
        public async Task<ActionResult<IEnumerable<Entrada>>> GetEntradas([FromQuery] DateTime? initialDate,
            [FromQuery] DateTime? endDate)
        {
            try
            {
                // 14-10-2021 00:00
                // 14-10-2021 23:59
                Thread.CurrentThread.CurrentCulture = new CultureInfo("pt-BR", false);
                var date = DateTime.Now;
                var initial = DateTime.Now.Date.AddHours(00).AddMinutes(00).AddSeconds(00);
                var final = DateTime.Now.AddHours(23).AddMinutes(59).AddSeconds(59);
                if (initialDate.HasValue)
                {
                    initial = initialDate.Value;
                    initial = new DateTime(initial.Year, initial.Month, initial.Day, 00, 00, 00);
                }

                if (endDate.HasValue)
                {
                    final = endDate.Value;
                    final = new DateTime(final.Year, final.Month, final.Day, 23, 59, 59);
                }

                var data = await _context
                    .Entradas
                    .FromSqlRaw(
                        "SELECT " +
                        " ENT.FILIAL       AS Filial," +
                        " ENT.GRUPOEMP," +
                        " ENT.CODMOVIMENTO AS CodMovimento," +
                        " ENT.CODPACIENTE  AS CodPaciente," +
                        " ENT.DATAHORAENT  AS DataHoraEnt," +
                        " PAC.PACIENTE     AS NomePaciente," +
                        " PAC.SEXO         AS Sexo," +
                        " PAC.DATANASC     AS DataNasc," +
                        " EX.IDEXAME       AS IDExame, " +
                        " EX.CODAMB        AS CodigoProcedimento," +
                        " EX.DESCR         AS NomeProcedimento, " +
                        " MED.CODMEDICO    AS CodigoMedico," +
                        " MED.NOME         AS MedicoExecutante" +
                        " FROM ENTRADA AS ENT " +
                        "INNER JOIN CADPACIENTE AS PAC ON (PAC.CODPACIENTE = ENT.CODPACIENTE) " +
                        "INNER JOIN EXAME AS EX ON (EX.CODPACIENTE = ENT.CODMOVIMENTO) " +
                        "AND EX.FILIAL = ENT.FILIAL" +
                        " LEFT JOIN CADMEDICO AS MED ON (MED.CODMEDICO = EX.CODMEDICO) " +
                        "AND MED.FILIAL IN ('99', EX.FILIAL)WHERE ENT.FECHADO <> 'C'  AND ENT.LOTEENT <> 'INAT' " +
                        "AND LEFT(ISNULL(ENT.MOTIVO, ''), 6) <> 'ZERADO'  " +
                        "AND EX.CODAMB IN (SELECT CODPROCEDIMENTO FROM EXAMELAUDO EL WHERE EL.FILIAL IN ('99', EX.FILIAL))  " +
                        "AND ENT.DATAHORAENT BETWEEN @initialDate AND @endDate",
                        new SqlParameter("@initialDate", initial),
                        new SqlParameter("@endDate", final)
                    )
                    .ToListAsync();

                return Ok(data);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
    }
}