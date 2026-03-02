// Kullanıcı ve oturum ile ilgili veri tipleri bu dosyada tanımlanmıştır

// Uygulamada oturum açmış kullanıcıyı temsil eden arayüz
export interface User {
    id: string;           // Benzersiz kullanıcı kimliği
    email: string;        // Kullanıcının e-posta adresi (giriş için kullanılır)
    name: string;         // Kullanıcının görünen adı
    profileUrl?: string;  // Opsiyonel: profil görseli URL'i veya avatar baş harfi
}

// Giriş formundan alınan kullanıcı bilgilerini temsil eden arayüz
export interface LoginForm {
    email: string;    // Giriş e-postası
    password: string; // Giriş şifresi (minimum 6 karakter)
}

// Tarayıcı sessionStorage'ında saklanan oturum verilerini temsil eder
// Session 24 saat (expiresIn ms) sonra geçersiz sayılır
export interface Session {
    user: User;       // Oturum açmış kullanıcı bilgileri
    timestamp: number; // Oturumun başlatıldığı Unix timestamp (ms)
    expiresIn: number; // Oturum geçerlilik süresi (ms cinsinden, 24 saat = 86400000)
}