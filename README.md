# Torschusspanik! – Gut gemeint aber grandios gescheitert

Ein kleines, statisches Browser-Spiel (HTML/CSS/JavaScript), für Desktop und Smartphone gedacht.

## Dateien

- `index.html` – Bildschirme und Audioelemente
- `style.css` – Retro-/Pixel-Design und responsive Layout
- `game.js` – Spielmechanik, Steuerung, Punkte und Musikwechsel
- `assets/cover.png` – aktueller Coverentwurf als Startbildschirm
- `assets/flamingo.png` – neu gestalteter, leicht verpixelter Flamingo mit Überwachungskamera-Kopf
- `assets/background-music.mp3` – **Platzhalter: hier deine 8-bit-Hintergrundmusik ablegen**
- `assets/chorus.mp3` – **Platzhalter: hier den Refrain für das normale Scheitern ablegen**
- `assets/es-gibt-kein-zurueck.mp3` – **Platzhalter: hier den Song-Snippet für die gescheiterte Zeitreise ablegen**

## Audio ergänzen

Lege deine Audiodateien in `assets/` und benenne sie exakt:

- `background-music.mp3`
- `chorus.mp3`
- `es-gibt-kein-zurueck.mp3`

Die Dateien sind absichtlich nicht enthalten. Das Spiel zeigt einen Hinweis an, wenn eine Audiodatei fehlt. Alternativ kannst du die `src`-Pfade in `index.html` anpassen.

## Lokal testen

Öffne `index.html` im Browser. Für zuverlässigeres Verhalten kannst du einen lokalen statischen Server verwenden, z. B. die VS-Code-Erweiterung Live Server.

## Kostenlos über GitHub Pages veröffentlichen

1. Erstelle ein neues GitHub-Repository.
2. Lade den Inhalt dieses Ordners in das Repository hoch.
3. Öffne **Settings → Pages**.
4. Wähle **Deploy from a branch**, den Branch `main` und den Ordner `/ (root)`.
5. Speichere. GitHub Pages zeigt nach dem Build die öffentliche URL an.

Das Repository und die Audiodateien sind bei einem öffentlichen GitHub-Pages-Projekt öffentlich zugänglich. Verwende nur Musik, deren Veröffentlichung du kontrollierst bzw. für die du die nötigen Rechte hast.

## Hinweise

- Der Startbildschirm verwendet das Cover als Bild und legt eine transparente klickbare Fläche über den „OK“-Button. Wenn du das Cover austauschst oder dessen Layout änderst, muss die Position von `#cover-ok` in `style.css` ggf. angepasst werden.
- Das Spiel ist ein erster spielbarer Prototyp. Vor der Veröffentlichung sollten die Kollisionen, Touch-Steuerung, Bildschirmgrößen und Audioübergänge auf echten Geräten getestet und feinjustiert werden.

## Ende bei 99 CDs und Spotify-Links

Bei 99 gesammelten CDs erscheint zunächst die vermeintliche Gewinnmeldung zur Zeitreise ins Jahr 1999. Nach kurzer Verzögerung schlägt die Zeitreise fehl und `es-gibt-kein-zurueck.mp3` wird abgespielt. Beim normalen Game Over läuft `chorus.mp3`.

In `index.html` kannst du die beiden Spotify-Platzhalter ersetzen:

- `https://open.spotify.com/PLACEHOLDER-SONG-LINK` – Link im normalen Game Over
- `https://open.spotify.com/PLACEHOLDER-ALBUM-LINK` – Link auf dem Zeitreise-Endbildschirm

Suche nach `PLACEHOLDER`, um die Stellen schnell zu finden.
