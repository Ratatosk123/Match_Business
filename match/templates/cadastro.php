<?php
if(isset($_POST['cadastrar'])) {
    require_once('../config.php');
    
    // Verificar conexão
    if (!$conexao) {
        echo "<script>alert('Erro de conexão: " . mysqli_connect_error() . "');</script>";
        exit;
    }
    
    // Verificar se todos os campos obrigatórios foram enviados
    $campos_obrigatorios = ['nome', 'email', 'CNPJ', 'senha', 'confirmar_senha'];
    $campos_faltando = [];
    
    foreach($campos_obrigatorios as $campo) {
        if(!isset($_POST[$campo]) || empty($_POST[$campo])) {
            $campos_faltando[] = $campo;
        }
    }
    
    if(!empty($campos_faltando)) {
        echo "<script>alert('Campos obrigatórios faltando: " . implode(', ', $campos_faltando) . "');</script>";
        exit;
    }
    
    // Verificar se as senhas coincidem
    if($_POST['senha'] !== $_POST['confirmar_senha']) {
        echo "<script>alert('As senhas não coincidem!');</script>";
        exit;
    }
    
    // Verificar força da senha (mínimo 8 caracteres)
    if(strlen($_POST['senha']) < 8) {
        echo "<script>alert('A senha deve ter no mínimo 8 caracteres!');</script>";
        exit;
    }
    
    // Verificar se CNPJ já existe
    $CNPJ = mysqli_real_escape_string($conexao, $_POST['CNPJ']);
    $email = mysqli_real_escape_string($conexao, $_POST['email']);
    
    $check_cnpj_query = "SELECT CNPJ FROM `formulario-matchbusiness`.`formulario` WHERE CNPJ = '$CNPJ' LIMIT 1";
    $check_cnpj_result = mysqli_query($conexao, $check_cnpj_query);
    
    if(!$check_cnpj_result) {
        echo "<script>alert('Erro na verificação de CNPJ: " . mysqli_error($conexao) . "');</script>";
        exit;
    }
    
    // Verificar se Email já existe
    $check_email_query = "SELECT email FROM `formulario-matchbusiness`.`formulario` WHERE email = '$email' LIMIT 1";
    $check_email_result = mysqli_query($conexao, $check_email_query);
    
    if(!$check_email_result) {
        echo "<script>alert('Erro na verificação de Email: " . mysqli_error($conexao) . "');</script>";
        exit;
    }
    
    // Verificar duplicações
    $cnpj_existe = mysqli_num_rows($check_cnpj_result) > 0;
    $email_existe = mysqli_num_rows($check_email_result) > 0;
    
    if($cnpj_existe && $email_existe) {
        echo "<script>
                alert('CNPJ e Email já foram cadastrados!');
                document.querySelector('input[name=\"CNPJ\"]').value = '';
                document.querySelector('input[name=\"email\"]').value = '';
                document.querySelector('input[name=\"CNPJ\"]').focus();
              </script>";
        exit;
    } elseif($cnpj_existe) {
        echo "<script>
                alert('CNPJ já foi cadastrado!');
                document.querySelector('input[name=\"CNPJ\"]').value = '';
                document.querySelector('input[name=\"CNPJ\"]').focus();
              </script>";
        exit;
    } elseif($email_existe) {
        echo "<script>
                alert('Email já foi cadastrado!');
                document.querySelector('input[name=\"email\"]').value = '';
                document.querySelector('input[name=\"email\"]').focus();
              </script>";
        exit;
    }
    
    // Criar hash seguro da senha
    $senha_hash = password_hash($_POST['senha'], PASSWORD_DEFAULT);
    
    // Preparar dados para inserção
    $nome = mysqli_real_escape_string($conexao, $_POST['nome']);
    $cep = mysqli_real_escape_string($conexao, $_POST['CEP'] ?? '');
    $endereco = mysqli_real_escape_string($conexao, $_POST['endereco'] ?? '');
    $bairro = mysqli_real_escape_string($conexao, $_POST['bairro'] ?? '');
    $pais = mysqli_real_escape_string($conexao, $_POST['pais'] ?? '');
    $estado = mysqli_real_escape_string($conexao, $_POST['estado'] ?? '');
    $rua_numero = mysqli_real_escape_string($conexao, $_POST['rua_numero'] ?? '');
    $telefone = mysqli_real_escape_string($conexao, $_POST['telefone'] ?? '');
    $tipo_contrato = mysqli_real_escape_string($conexao, $_POST['tipo_contrato'] ?? '');
    
    // Garantir que campos vazios tenham string vazia
    if (empty($cep)) $cep = '';
    if (empty($endereco)) $endereco = '';
    if (empty($bairro)) $bairro = '';
    if (empty($pais)) $pais = '';
    if (empty($estado)) $estado = '';
    if (empty($rua_numero)) $rua_numero = '';
    if (empty($telefone)) $telefone = '';
    if (empty($tipo_contrato)) $tipo_contrato = '';
    
    // USAR PREPARED STATEMENTS para evitar problemas com auto-increment
    $query = "INSERT INTO `formulario-matchbusiness`.`formulario` 
              (nome, email, CNPJ, CEP, endereco, bairro, pais, estado, rua_numero, telefone, tipo_contrato, senha_hash) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = mysqli_prepare($conexao, $query);
    
    if (!$stmt) {
        echo "<script>alert('Erro ao preparar query: " . mysqli_error($conexao) . "');</script>";
        exit;
    }
    
    // Vincular parâmetros
    mysqli_stmt_bind_param($stmt, 'ssssssssssss', 
        $nome, 
        $email, 
        $CNPJ, 
        $cep, 
        $endereco, 
        $bairro, 
        $pais, 
        $estado, 
        $rua_numero, 
        $telefone, 
        $tipo_contrato, 
        $senha_hash
    );
    
    // Executar
    if (mysqli_stmt_execute($stmt)) {
        // Sucesso - redirecionar para login
        mysqli_stmt_close($stmt);
        mysqli_close($conexao);
        echo "<script>
                window.location.href = 'login.php?cadastro=sucesso';
              </script>";
        exit();
    } else {
        echo "<script>alert('Erro ao cadastrar: " . mysqli_stmt_error($stmt) . "');</script>";
        mysqli_stmt_close($stmt);
    }
    
    mysqli_close($conexao);
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro</title>
    <link rel="stylesheet" href="../static/style.css">
    <link rel="stylesheet" href="../static/cadastro.css">
</head>
<body>
    <header class="cabecalho">
        <nav class="navbar">
            <div class="navbar-logo">
                <img src="../static/images/logo2.0.png" alt="logo">
                <h1>Match Business</h1>
            </div>
            <div class="navbar-buttons">
                <a href="login.php" class="button-login">Login</a>
                <a href="cadastro.php" class="button-cadastro">Cadastro</a>
            </div>
        </nav>
    </header>
    <main>
        <h2>Cadastro</h2>
        
        <ul>
            <form action="cadastro.php" method="POST">
                <li class="Nome">Nome da Empresa</li>
                <input type="text" name="nome" placeholder="Digite aqui o Nome da Empresa" required>

                <li class="Email">Email Empresarial</li>
                <input type="email" name="email" placeholder="Digite aqui o Email Empresarial" required>

                <li class="CNPJ">CNPJ da Empresa</li>
                <input type="text" name="CNPJ" placeholder="Digite aqui o CNPJ da Empresa" id="CNPJ" maxlength="18" onkeypress="formatarCNPJ(this)" required>
            
                <li class="tipo_contrato">
                    Tipo de Contrato
                    <div class="checkbox-group">
                        <input type="radio" id="Check1" name="tipo_contrato" value="oferecendo">
                        <label for="Check1">Oferecendo Serviços</label>
                    </div>
                    <div class="checkbox-group">
                        <input type="radio" id="Check2" name="tipo_contrato" value="procurando">
                        <label for="Check2">Procurando</label>
                    </div>
                    <div class="checkbox-group">
                        <input type="radio" id="Check3" name="tipo_contrato" value="ambos">
                        <label for="Check3">Ambos</label>
                    </div>
                </li>

                <li class="CEP">CEP</li>
                <input type="text" name="CEP" placeholder="Digite aqui o CEP">

                <li class="Endereço">Endereço</li>
                <input type="text" name="endereco" placeholder="Digite aqui o Endereço">

                <li class="Bairro">Bairro</li>
                <input type="text" name="bairro" placeholder="Digite aqui o Bairro">

                <li class="País">País</li>
                <input type="text" name="pais" placeholder="Digite aqui o País">

                <li class="Estado">Estado</li>
                <input type="text" name="estado" placeholder="Digite aqui o Estado">

                <li class="Rua e Número">Rua e número</li>
                <input type="text" name="rua_numero" placeholder="Digite aqui a Rua e Número">

                <li class="Telefone">Telefone Empresarial</li>
                <input type="tel" name="telefone" placeholder="Digite aqui o Telefone Empresarial">

                <li class="Senha">Senha</li>
                <input type="password" name="senha" placeholder="Digite aqui a Senha" required>

                <li class="Confirmar Senha">Confirmar Senha</li>
                <input type="password" name="confirmar_senha" placeholder="Digite aqui a Senha" required>
                
                <button type="submit" name="cadastrar" src="login.php" class="btn">Cadastrar</button>
            </form>
        </ul>
        <script src="../static/js/index.js"></script>
        <script src="../static/js/formatarCNPJ.js"></script>
        <script src="../static/js/formatarTelefone.js"></script>
        <script src="../static/js/formatarCEP.js"></script>
    </main>
</body>
</html>
    