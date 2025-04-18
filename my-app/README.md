# MLM CRM - Frontend

Ein intelligentes CRM für MLM-Versicherungsvertreter, das sowohl das Versicherungsgeschäft als auch den Aufbau von Teams unterstützt.

## Überblick

Dieses Repository enthält den Frontend-Code für die MLM CRM Anwendung, eine spezialisierte CRM-Lösung für Versicherungsvertreter in MLM-Strukturen. Die Anwendung ermöglicht die Verwaltung von Kontakten, Aufgaben, Pipelines und Teams und bietet Premium-Funktionen wie KI-gestützte Lead-Bewertung und Follow-Up-Vorschläge.

## Hauptfunktionen

- **Kontaktverwaltung**: Verwaltung von Kunden und potentiellen Partnern
- **Aufgabenverwaltung**: Planung und Nachverfolgung von Aufgaben
- **Pipeline-Visualisierung**: Tracking von Verkaufs- und Rekrutierungsprozessen
- **Team-Übersicht**: Verwaltung der Downline (nur Premium)
- **KI-Features**: Lead-Scoring und Follow-Up-Vorschläge (nur Premium)

## Technologie-Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Django, Django REST Framework
- **Authentifizierung**: JWT-Token
- **Datenspeicherung**: PostgreSQL
- **KI-Integration**: Google AI Services

## Projektstruktur

Die Anwendung ist modular aufgebaut und nach Funktionsbereichen organisiert. Siehe [STRUKTUR.md](STRUKTUR.md) für eine detaillierte Dokumentation der Projektstruktur.

## CSS-Organisation

Das Styling basiert auf Tailwind CSS und ist in modulare CSS-Dateien organisiert. Siehe [CSS-Struktur.md](CSS-Struktur.md) für eine detaillierte Dokumentation der CSS-Organisation.

## Installation und Entwicklung

### Voraussetzungen

- Node.js (>= 14.x)
- npm (>= 7.x)

### Installation

1. Repository klonen:
   ```
   git clone [repository-url]
   cd mlm-crm-frontend
   ```

2. Abhängigkeiten installieren:
   ```
   npm install
   ```

3. Umgebungsvariablen konfigurieren:
   Erstelle eine `.env`-Datei im Root-Verzeichnis und füge folgende Variablen hinzu:
   ```
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```

4. Entwicklungsserver starten:
   ```
   npm start
   ```

5. Für den Produktions-Build:
   ```
   npm run build
   ```

## Integration mit dem Backend

Die Kommunikation mit dem Backend erfolgt über den zentralen API-Service in `services/api.js`. Dieser Service kümmert sich um die Authentifizierung und Fehlerbehandlung.

## Nächste