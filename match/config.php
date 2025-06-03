<?php
    $db_host = 'localhost';
    $dbUsername = 'root';
    $dbPassword = '';
    $dbName = 'formulario-matchbusiness';
    
    $conexao = new mysqli($db_host, $dbUsername, $dbPassword, $dbName);

    // Verificar conexão e mostrar erro se falhar
    if ($conexao->connect_errno) {
        die("Erro de conexão: " . $conexao->connect_error);
    }
?>
