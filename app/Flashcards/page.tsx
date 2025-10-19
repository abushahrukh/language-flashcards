// app/Flashcards/page.tsx
"use client";
import { useState, useEffect } from "react";

type WordEntry = {
  english: string;
  urdu: string;
  russian: string;
  korean: string;
};

const sampleWords: WordEntry[] = [
  { english: "Hello", urdu: "ہیلو", russian: "Привет", korean: "안녕하세요" },
  { english: "Goodbye", urdu: "الوداع", russian: "До свидания", korean: "안녕히 가세요" },
  { english: "Thank you", urdu: "شکریہ", russian: "Спасибо", korean: "감사합니다" },
  { english: "Yes", urdu: "جی ہاں", russian: "Да", korean: "네" },
  { english: "No", urdu: "نہیں", russian: "Нет", korean: "아니요" },
  { english: "Water", urdu: "پانی", russian: "Вода", korean: "물" },
  { english: "Food", urdu: "کھانا", russian: "Еда", korean: "음식" },
  { english: "House", urdu: "گھر", russian: "Дом", korean: "집" },
  { english: "Book", urdu: "کتاب", russian: "Книга", korean: "책" },
  { english: "Friend", urdu: "دوست", russian: "Друг", korean: "친구" },
];

export default function Flashcards() {
  const [words, setWords] = useState<WordEntry[]>(sampleWords); // Start with sample words immediately
  const [index, setIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [language, setLanguage] = useState<"korean" | "russian" | null>(null);
  const [dataSource, setDataSource] = useState<"sample" | "csv">("sample");

  // Try to load CSV in background, but don't block the UI
  useEffect(() => {
    const tryLoadCSV = async () => {
      try {
        console.log("Attempting to load CSV...");
        
        // Try multiple paths
        const paths = ['./words.csv', 'words.csv', '/words.csv'];
        
        for (const path of paths) {
          try {
            const response = await fetch(path);
            if (response.ok) {
              const csvText = await response.text();
              console.log("CSV content:", csvText);
              
              if (csvText.trim()) {
                const rows = csvText.trim().split('\n');
                if (rows.length > 1) {
                  const parsedWords: WordEntry[] = [];
                  
                  for (let i = 1; i < rows.length; i++) {
                    const columns = rows[i].split(',');
                    if (columns.length >= 4) {
                      const word: WordEntry = {
                        english: columns[0]?.trim() || '',
                        urdu: columns[1]?.trim() || '',
                        russian: columns[2]?.trim() || '',
                        korean: columns[3]?.trim() || '',
                      };
                      
                      // Only add if it has content
                      if (word.english && (word.korean || word.russian)) {
                        parsedWords.push(word);
                      }
                    }
                  }
                  
                  if (parsedWords.length > 0) {
                    console.log(`Loaded ${parsedWords.length} words from CSV`);
                    const shuffled = parsedWords.sort(() => Math.random() - 0.5);
                    setWords(shuffled);
                    setDataSource("csv");
                    return;
                  }
                }
              }
            }
          } catch (error) {
            console.log(`Failed to load from ${path}:`, error);
          }
        }
        
        console.log("CSV loading failed, using sample words");
      } catch (error) {
        console.log("Error in CSV loading:", error);
      }
    };

    tryLoadCSV();
  }, []);

  // Show language selection
  if (!language) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        gap: '16px'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>
          Language Flashcards
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 16px 0' }}>
          Choose your learning language
        </h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => setLanguage("korean")}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.125rem',
              cursor: 'pointer'
            }}
          >
            🇰🇷 Korean
          </button>
          <button
            onClick={() => setLanguage("russian")}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.125rem',
              cursor: 'pointer'
            }}
          >
            🇷🇺 Russian
          </button>
        </div>
        <p style={{ color: '#6b7280', marginTop: '16px' }}>
          Loaded {words.length} words ({dataSource === "csv" ? "from CSV" : "sample data"})
        </p>
      </div>
    );
  }

  const current = words[index];

  const nextWord = () => {
    setShowMeaning(false);
    setIndex((i) => (i + 1) % words.length);
  };

  const prevWord = () => {
    setShowMeaning(false);
    setIndex((i) => (i - 1 + words.length) % words.length);
  };

  const progress = ((index + 1) / words.length) * 100;

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '16px',
      gap: '24px'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>
        Language Flashcards
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          margin: '0 0 24px 0',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {language === "korean" ? current.korean : current.russian}
        </h2>

        {showMeaning && (
          <div style={{ textAlign: 'center', gap: '12px', marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
              {current.english}
            </p>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', margin: 0 }}>
              {current.urdu}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={prevWord}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e5e7eb',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ⬅️ Previous
          </button>

          <button
            onClick={() => setShowMeaning((s) => !s)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {showMeaning ? "Hide Meaning" : "Show Meaning"}
          </button>

          <button
            onClick={nextWord}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Next ➡️
          </button>
        </div>
      </div>

      <div style={{ width: '256px' }}>
        <div style={{
          width: '100%',
          backgroundColor: '#e5e7eb',
          borderRadius: '9999px',
          height: '12px'
        }}>
          <div
            style={{
              backgroundColor: '#10b981',
              height: '12px',
              borderRadius: '9999px',
              width: `${progress}%`,
              transition: 'width 0.3s'
            }}
          ></div>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', margin: '8px 0 0 0' }}>
          {index + 1} / {words.length} words ({progress.toFixed(1)}%)
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setLanguage("korean")}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: language === "korean" ? '#3b82f6' : '#e5e7eb',
            color: language === "korean" ? 'white' : 'black'
          }}
        >
          🇰🇷 Korean
        </button>
        <button
          onClick={() => setLanguage("russian")}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: language === "russian" ? '#ef4444' : '#e5e7eb',
            color: language === "russian" ? 'white' : 'black'
          }}
        >
          🇷🇺 Russian
        </button>
      </div>

      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
        Using {dataSource === "csv" ? "CSV data" : "sample data"}
      </p>
    </div>
  );
}