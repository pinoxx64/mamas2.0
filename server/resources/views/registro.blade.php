<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Cuenta</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="text-align: center; color: #4CAF50;">¡Cuenta creada exitosamente!</h2>
        <p>Hola <strong>{{ $userName }}</strong>,</p>
        <p>Se ha creado una cuenta en nuestra plataforma usando tu correo electrónico: <strong>{{ $email }}</strong>.</p>
        <p>Para activar la cuenta deberas activarlo en el siguiente boton</p>
        <p>
            <button style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">
                <a href="http://localhost:5173/src/pages/activarRegister/activarRegister.html" style="color: white; text-decoration: none;">Activar Cuenta</a>
        </p>
        <p>Gracias por unirte a <strong>Mamas Oficial</strong>.</p>
        <hr>
        <p style="text-align: center; font-size: 0.9em; color: #777;">
            Este es un mensaje automático, por favor no respondas a este correo.
        </p>
    </div>
</body>
</html>