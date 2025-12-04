# Guide de Déploiement (Ubuntu)

Voici les étapes pour déployer l'application sur votre serveur.

## 1. Préparation du Frontend (Local)

J'ai déjà configuré `src/lib/pocketbase.ts` et créé `.env.production` pour pointer vers `https://backend.rimconseil.com`.

1.  **Construire l'application** :
    ```bash
    npm run build
    ```
    Cela va créer un dossier `dist`.

## 2. Configuration du Serveur (Ubuntu)

Connectez-vous à votre serveur via SSH.

### Pré-requis
Installez Nginx et Certbot si ce n'est pas déjà fait :
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx unzip
```

### A. Déploiement du Backend (PocketBase)

1.  **Créer le dossier** :
    ```bash
    mkdir -p /opt/pocketbase
    cd /opt/pocketbase
    ```
2.  **Télécharger/Copier PocketBase** :
    Transférez votre exécutable `pocketbase` (version linux) dans ce dossier.
    Si vous ne l'avez pas, téléchargez-le :
    ```bash
    wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.21/pocketbase_0.22.21_linux_amd64.zip
    unzip pocketbase_0.22.21_linux_amd64.zip
    chmod +x pocketbase
    ```
3.  **Créer le service Systemd** :
    Créez le fichier `/etc/systemd/system/pocketbase.service` :
    ```ini
    [Unit]
    Description = pocketbase

    [Service]
    Type           = simple
    User           = root
    Group          = root
    LimitNOFILE    = 4096
    Restart        = always
    RestartSec     = 5s
    StandardOutput = append:/opt/pocketbase/errors.log
    StandardError  = append:/opt/pocketbase/errors.log
    ExecStart      = /opt/pocketbase/pocketbase serve --http="127.0.0.1:8090"

    [Install]
    WantedBy = multi-user.target
    ```
4.  **Démarrer le service** :
    ```bash
    sudo systemctl enable pocketbase
    sudo systemctl start pocketbase
    ```

### B. Configuration Nginx pour le Backend

Créez `/etc/nginx/sites-available/backend.rimconseil.com` :

```nginx
server {
    server_name backend.rimconseil.com;

    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activez le site :
```bash
sudo ln -s /etc/nginx/sites-available/backend.rimconseil.com /etc/nginx/sites-enabled/
```

### C. Déploiement du Frontend

1.  **Créer le dossier** :
    ```bash
    sudo mkdir -p /var/www/v2.rimconseil.com
    ```
2.  **Transférer les fichiers** :
    Copiez le contenu du dossier `dist` (généré à l'étape 1) vers `/var/www/v2.rimconseil.com` sur le serveur (utilisez SCP ou FileZilla).
    ```bash
    # Exemple SCP depuis votre machine locale
    scp -r dist/* user@votre-ip:/var/www/v2.rimconseil.com/
    ```
3.  **Configuration Nginx pour le Frontend** :
    Créez `/etc/nginx/sites-available/v2.rimconseil.com` :

```nginx
server {
    server_name v2.rimconseil.com;
    root /var/www/v2.rimconseil.com;
    index index.html;

    # Gérer le routage React (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache pour les assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

Activez le site :
```bash
sudo ln -s /etc/nginx/sites-available/v2.rimconseil.com /etc/nginx/sites-enabled/
```

### D. Finalisation et SSL

1.  **Vérifier la config Nginx** :
    ```bash
    sudo nginx -t
    ```
2.  **Redémarrer Nginx** :
    ```bash
    sudo systemctl restart nginx
    ```
3.  **Activer HTTPS (SSL)** :
    ```bash
    sudo certbot --nginx -d backend.rimconseil.com -d v2.rimconseil.com
    ```

C'est tout ! Votre backend sera accessible sur `https://backend.rimconseil.com` et votre frontend sur `https://v2.rimconseil.com`.
