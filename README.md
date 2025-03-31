# GIERA NA CYBERBIWAK - SHOP TO AKTUALNA APKA

## Getting Started

```bash
cd shop

npm install

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Obsługa

## 1. Tryb Admina
- **ZMIENIAĆ CZAS LUB RESETOWAĆ GRĘ NALEŻY PRZY OTWARTEJ TYLKO JEDNEJ KARCIE APLIKACJI!!!** (local storage się kłóci pomiędzy instancjami)
- Funkcje:
  - Zmiana balansu gracza.
  - Zmiana czasu.
  - Dodawanie przedmiotów do ekwipunku.
  - Resetowanie gry.
- Hasło: `n1gg4`

## 2. Testowanie
- Działanie funkcji bazujących na czasie (zamówienia, eventy) najlepiej testować zmieniając czas w adminie (np. zamawiasz 20 chlebów, wchodzisz w panel admina i przyspieszasz rundę albo ustawiasz czas na `45:00` i **podziwiasz piękny scam na `Alegro`**)

## 3. Bonusowy Kod
- Struktura kodu (oddzielone `spacjami` lub `-`):
    - Nazwa zasobu zamieniona na ASCII 
    - Ilość w hex
    - (ilość * runda) + (ilość % runda) w dziesiętnym

## 4. Reklamy i Promocje
- Wyświetlanie dynamicznych reklam, takich jak:
  - "Lucky User Ad" – `55:00` i `28:00`.
  - "Allegro Redirect" – przekierowanie do scam stronki "Alegro" - `45:00`, `37:00`, `22:00`, `15:00`, `7:00`, `2:00`.

## 5. Obsługa Lokalna
- Wszystkie dane, takie jak ekwipunek, historia zakupów, użyte kody i balans, są przechowywane w Local Storage.
- Dane są automatycznie ładowane przy ponownym uruchomieniu aplikacji.

## 6. Koniec Gry
- Pod koniec gry automatycznie pobierany jest plik z podsumowaniem.