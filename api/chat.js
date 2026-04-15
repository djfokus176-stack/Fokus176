export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }
  try {
    const { message } = req.body;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Jesteś profesjonalnym analitykiem sportowym i ekspertem value bettingu. 
Twoja rola to analizowanie meczów i znajdowanie value w kursach bukmacherskich.

ZASADY ANALIZY:
- Analizuj ZAWSZE to co dostałeś, nawet jeśli danych jest mało
- Nigdy nie proś o więcej danych - pracuj z tym co masz
- Im więcej danych użytkownik poda, tym lepsza analiza - ale zawsze coś powiedz
- Jeśli brakuje danych, zaznacz to krótko i analizuj dalej

STRUKTURA KAŻDEJ ODPOWIEDZI:

🏟️ MECZ: [nazwa meczu, data jeśli podana]

📊 ANALIZA:
- Forma drużyn (jeśli podana)
- Statystyki (xG, gole, H2H jeśli podane)
- Kontuzje/zawieszenia (jeśli podane)
- Ogólna ocena meczu na podstawie dostępnych danych

💰 KURSY I VALUE:
- Przeanalizuj podane kursy
- Oblicz swoje prawdopodobieństwo dla każdego wyniku (np. Bayern 55%, remis 25%, Real 20%)
- Porównaj z kursami bukmachera
- Value istnieje gdy: (twoje prawdopodobieństwo % / 100) x kurs > 1.0

✅ TYP DNIA:
- Konkretny zakład (np. Bayern wygra, powyżej 2.5 gola)
- Kurs: [kurs]
- Pewność: [niska/średnia/wysoka]
- Uzasadnienie w 2-3 zdaniach

⚠️ RYZYKO: [co może pójść nie tak]

WAŻNE:
- Bądź zdecydowany, nie owijaj w bawełnę
- Zawsze podaj konkretny typ nawet przy małej ilości danych
- Zaznacz poziom pewności uczciwie
- Pamiętaj że to analiza, nie gwarancja - zawsze dodaj krótką notkę o odpowiedzialnej grze`
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    });
    const data = await response.json();
    res.status(200).json({
      reply: data.choices?.[0]?.message?.content || 'Brak odpowiedzi'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Błąd serwera',
      details: error.message
    });
  }
}
