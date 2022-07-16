using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace SISACIMAGE.Models
{
    /// <summary>
    ///     Classe responsável de fazer comunicação entre as classes e a base de dados
    /// </summary>
    public class Logic
    {
        public IConfiguration Configuration { get; }

        #region "Scalar"

        /// <summary>
        ///     Método responsável por executar um comando que retorna a primeira linha e a primeira coluna do resultado
        /// </summary>
        /// <param name="cmd">Comando para a execução</param>
        /// <returns>Retorna o objeto da base de dados</returns>
        public object Scalar(SqlCommand cmd)
        {
            using (var con = new SqlConnection(Configuration.GetConnectionString("DefaultConnection")))
            {
                con.Open();
                cmd.Connection = con;
                return cmd.ExecuteScalar();
            }
        }

        #endregion

        #region "Map"

        /// <summary>
        ///     Método Genérico responsável de passar os valores do datareader para a instância da classe automaticamente
        /// </summary>
        /// <typeparam name="T">Classe do Contexto</typeparam>
        /// <param name="record">Instância do DataReader</param>
        /// <param name="obj">Instância da Classe</param>
        /// <returns>Retorna Instância da Classe</returns>
        public T Map<T>(IDataRecord record, T obj) where T : new()
        {
            string fieldName;
            var properties = typeof(T).GetProperties();
            for (var i = 0; i < record.FieldCount; i++)
            {
                fieldName = record.GetName(i);

                foreach (var property in properties)
                    if (property.Name.ToLower() == fieldName.ToLower())
                        if (record[i] != DBNull.Value)
                        {
                            property.SetValue(obj, record[i], null);
                            break;
                        }
            }

            return obj;
        }

        /// <summary>
        ///     Método Genérico que atribui as propriedades da classe aos parâmetros do SQL
        /// </summary>
        /// <typeparam name="T">Classe do Contexto</typeparam>
        /// <param name="Parametros">Caso queira passar os parâmetros manualmente. (Separados por virgula e sem espaços)</param>
        /// <param name="cmd">Comando para execução</param>
        /// <param name="obj">Classe que será mapeada</param>
        /// <returns>Retorna umcomando SQL</returns>
        public SqlCommand GetParameters<T>(string Parametros, SqlCommand cmd, T obj) where T : class
        {
            var cmdParam = cmd;
            var propriedades = typeof(T).GetProperties();
            if (!string.IsNullOrEmpty(Parametros))
            {
                foreach (var item in Parametros.Split(','))
                foreach (var prop in propriedades)
                    if (prop.Name.ToLower() == item.ToLower())
                    {
                        var propValor = prop.GetValue(obj, null);
                        if (propValor != null)
                            cmdParam.Parameters.AddWithValue(item, propValor);
                        else
                            cmdParam.Parameters.AddWithValue(item, DBNull.Value);
                    }
            }
            else
            {
                foreach (var prop in propriedades)
                {
                    var propValor = prop.GetValue(obj, null);
                    if (propValor != null)
                        cmdParam.Parameters.AddWithValue("@" + prop.Name, prop.GetValue(obj, null));
                    else
                        cmdParam.Parameters.AddWithValue("@" + prop.Name, DBNull.Value);
                }
            }

            return cmdParam;
        }

        #endregion

        #region "Reader"

        /// <summary>
        ///     Método Genérico responsável de passar os valores do datareader para uma collection automaticamente
        /// </summary>
        /// <typeparam name="T">Classe do contexto</typeparam>
        /// <param name="cmd">SqlCommand</param>
        /// <returns>Retorna uma collection da instância da classe de contexto</returns>
        public List<T> ReaderAll<T>(SqlCommand cmd) where T : new()
        {
            var lista = new List<T>();
            using (var con = new SqlConnection())
            {
                con.Open();
                cmd.Connection = con;

                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        var obj = new T();
                        lista.Add(Map(dr, obj));
                    }
                }
            }

            return lista;
        }

        public List<T> ReaderAll<T>(SqlCommand cmd, out int count) where T : new()
        {
            count = 0;

            var lista = new List<T>();

            using (var con = new SqlConnection(Configuration.GetConnectionString("DefaultConnection")))
            {
                con.Open();
                cmd.Connection = con;

                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        var obj = new T();
                        lista.Add(Map(dr, obj));
                    }

                    if (dr.NextResult())
                        while (dr.Read())
                            count = dr.GetInt32(0);
                }
            }

            return lista;
        }

        public T Reader<T>(SqlCommand cmd, T obj) where T : class, new()
        {
            using (var con = new SqlConnection(Configuration.GetConnectionString("DefaultConnection")))
            {
                cmd.Connection = con;
                con.Open();
                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read()) obj = Map(dr, obj);
                }
            }

            return obj;
        }

        #endregion

        #region "Execute"

        /// <summary>
        ///     Método que executa transações na Base de Dados
        /// </summary>
        /// <param name="cmdCollection">Array com os comandos para a transação</param>
        /// <returns>Número de linhas afetadas</returns>
        public int Execute(SqlCommand[] cmdCollection)
        {
            var resultado = 0;
            using (var con = new SqlConnection(Configuration.GetConnectionString("DefaultConnection")))
            {
                con.Open();
                var tra = con.BeginTransaction();
                try
                {
                    foreach (var cmd in cmdCollection)
                        if (cmd != null)
                        {
                            cmd.Connection = con;
                            cmd.Transaction = tra;
                            resultado += cmd.ExecuteNonQuery();
                        }

                    tra.Commit();
                    return resultado;
                }
                catch
                {
                    tra.Rollback();
                    throw;
                }
            }
        }

        /// <summary>
        ///     Executa um comando na base de dados
        /// </summary>
        /// <param name="cmd">Comando para a execução</param>
        /// <returns>Número de Linhas afetadas</returns>
        public int Execute(SqlCommand cmd)
        {
            var resultado = 0;

            using (var con = new SqlConnection(Configuration.GetConnectionString("DefaultConnection")))
            {
                con.Open();
                cmd.Connection = con;
                resultado = cmd.ExecuteNonQuery();
                return resultado;
            }
        }

        #endregion
    }
}