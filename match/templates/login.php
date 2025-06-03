<?php
session_start();
require_once('../config.php');

$erro_login = '';
$sucesso_cadastro = '';

// Verificar se há mensagem de sucesso do cadastro
if (isset($_GET['cadastro']) && $_GET['cadastro'] === 'sucesso') {
    $sucesso_cadastro = 'Cadastro realizado com sucesso! Faça seu login.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Verificar conexão
        if (!$conexao) {
            throw new Exception("Erro de conexão com o banco de dados");
        }

        // Limpar e validar CNPJ
        $cnpj_input = $_POST['CNPJ'] ?? '';
        $senha = $_POST['senha'] ?? '';

        if (empty($cnpj_input) || empty($senha)) {
            throw new Exception("CNPJ e senha são obrigatórios");
        }

        // Limpar CNPJ (remover pontos, barras e hífens)
        $cnpj = preg_replace('/[^0-9]/', '', $cnpj_input);

        if (strlen($cnpj) < 11) {
            throw new Exception("CNPJ deve ter pelo menos 11 dígitos");
        }

        // Consulta usando prepared statement - buscar pelo CNPJ original (com formatação)
        $stmt = mysqli_prepare($conexao, "SELECT id, nome, senha_hash FROM `formulario-matchbusiness`.`formulario` WHERE CNPJ = ? OR CNPJ = ?");
        
        if (!$stmt) {
            throw new Exception("Erro ao preparar consulta: " . mysqli_error($conexao));
        }

        // Tentar buscar tanto com CNPJ formatado quanto sem formatação
        mysqli_stmt_bind_param($stmt, "ss", $cnpj_input, $cnpj);
        mysqli_stmt_execute($stmt);
        $resultado = mysqli_stmt_get_result($stmt);

        if (mysqli_num_rows($resultado) === 1) {
            $usuario = mysqli_fetch_assoc($resultado);
            
            // Verificar senha
            if (password_verify($senha, $usuario['senha_hash'])) {
                // Login bem-sucedido
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['usuario_nome'] = $usuario['nome'];
                $_SESSION['loggedin'] = true;
                
                mysqli_stmt_close($stmt);
                mysqli_close($conexao);
                
                // Redirecionar para página principal
                header("Location: index.html?login=sucesso");
                exit();
            } else {
                throw new Exception("CNPJ ou senha incorretos");
            }
        } else {
            throw new Exception("CNPJ ou senha incorretos");
        }
        
        mysqli_stmt_close($stmt);
        
    } catch (Exception $e) {
        $erro_login = $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../static/style.css">
    <link rel="stylesheet" href="../static/login.css">
    <title>Login</title>
</head>
<body>
    <header class="cabeçalho">
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
        <h2>Login</h2>

        <?php if (!empty($erro_login)): ?>
            <div class="alert alert-danger"><?php echo htmlspecialchars($erro_login); ?></div>
        <?php endif; ?>
        
        <ul>
            <div>
                <form action="login.php" class="loginForm" method="POST"> 
                    <li class="CNPJ">CNPJ</li>
                    <input type="text" placeholder="Digite aqui o CNPJ" id="CNPJ" name= "CNPJ" maxlength="18">
                </div>
                
                <div class="form-group">
                    <label for="Senha">Senha</label>
                    <input 
                    type="password"     
                    id="senha"
                    name="senha"  
                    placeholder="Digite sua senha" 
                    required
                    minlength="5"
                    >
                </div>
                
                <button type="submit" class="btn-login2">Entrar</button>
                
                <li class="Ainda">Ainda não tem uma conta?</li> 
                <button type="submit" src="index.html" class="btn-login">Cadastre-se</button>
                
                
                <script src="../static/js/login.js"></script>
                <script src="../static/js/formatarCNPJ.js"></script>
            </form>
        </ul>
    </main>
   
</body>
</html>