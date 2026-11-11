# Rencana Breakdown & Pembuatan Komponen Atomic (Create Member UI)

Dokumen ini menyelaraskan analisa kebutuhan komponen UI dari referensi desain form **Create Member** dengan prinsip **DRY**, **SOLID**, dan **Domain-Agnostic Atomic Design** pada `shared/presentation/components/`.

---

## 1. Prinsip Desain

1. **Domain-Agnostic di `shared/`:** Seluruh komponen di `shared/presentation/components/` tidak boleh mengandung konteks bisnis (`member`, `department`, `employmentType`, status `"active"`, atau skema validasi Zod tertentu).
2. **Library-Agnostic:** Komponen UI `shared/` tidak terikat langsung pada `react-hook-form` atau Redux; integrasi form cukup lewat props standar React (`name`, `value`, `onChange`, `onBlur`, `ref`, `aria-invalid`, `errorMessage`).
3. **DRY (Don't Repeat Yourself):** Logika dan markup berulang (seperti label, indikator `*` required, helper message, error message, dan slot icon di sebelah kiri) hanya ditulis sekali lalu dikomposisikan ulang.
4. **SOLID:**
   - **SRP:** `FormField` hanya mengurus layout label/required/helper/error; `IconInput` & `IconSelect` hanya mengurus kontrol dengan leading icon; `SectionCard` hanya mengurus header section + body slot.
   - **OCP:** `FormField` menerima `children` sehingga terbuka untuk kontrol apa pun (`Input`, `IconInput`, `IconSelect`, `Textarea`, dll.) tanpa perlu memodifikasi `FormField`.
   - **ISP:** Komponen tidak memaksa props yang tidak dibutuhkan oleh kontrol tertentu.

---

## 2. Pencocokan dengan Analisa & Evaluasi Arsitektur

### A. Card dengan `title`, `subtitle`, dan body content
- **Analisa:** Perlu komponen card (molekul atau organisme) yang memiliki `title`, `subtitle`, dan `children` (body content fleksibel untuk form input atau konten lainnya).
- **Penyelarasan:**
  1. **Atoms (`atoms/card.tsx` atau `atoms/card/`):** Tambahkan primitif `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` dari shadcn (`npx shadcn@latest add card`) sebagai fondasi styling surface, border, dan spacing.
  2. **Molecule (`molecules/section-card.tsx` — `SectionCard`):**
     - Lebih tepat ditempatkan sebagai **Molecule** (sejajar dengan `Header` di `molecules/header.tsx` dan `Identity` di `molecules/identity.tsx`) karena perannya murni membungkus komposisi sederhana: `title`, `subtitle` opsional, `rightContent` / `headerAction` opsional, `children` (body), dan `footer` opsional.
     - Pada referensi desain, terdapat dua blok identik (**General Information** dan **Work Details & Permissions**). Dengan `SectionCard`, keduanya memakai komponen yang sama tanpa duplikasi struktur header + body, dan tetap reusable untuk halaman non-form (misalnya halaman detail, settings, atau summary card).
     - Untuk container luar yang menyatukan beberapa `SectionCard` + footer bar (`Cancel` & `Save Changes`), fitur `CreateMemberForm` cukup mengkomposisikan `Card` + beberapa `SectionCard` + `CardFooter` (atau `ActionFooter` jika nanti dibutuhkan di form Edit juga).

### B. Field Input dengan `label`, `required`, `message`, `errorMessage`, dan `icon`
- **Analisa:** Perlu komponen field input siap pakai lengkap dengan `label`, `required?: boolean`, `message`, `errorMessage`, dan `icon` di samping input.
- **Observasi dari Referensi Desain:** Pada gambar referensi terdapat **tiga jenis kontrol berbeda** yang sama-sama membutuhkan `label`, `*` required, `message`, dan `errorMessage`:
  1. **Text Input + left icon** (`Full Name`, `Work Email`, `Job Title`) — sudah ada [`IconInput`](file:///home/ruslan/workspace/salt/fe-assessment/fe-assignment-2/shared/presentation/components/molecules/icon-input.tsx).
  2. **Select Dropdown + left icon** (`Account Status`, `Department`, `Employment Type`).
  3. **Textarea** (`Bio & Administrative Notes`).
- **Penyelarasan (agar tetap DRY & mengikuti OCP):**
  - Jika langsung membuat satu komponen monolitik `FieldInput` yang hardcoded ke `<Input>`, maka untuk `Select` dan `Textarea` kita akan terpaksa menduplikasi markup `label`, `*`, `message`, dan `errorMessage`.
  - Pendekatan yang lebih bersih dan SOLID:
    1. **`molecules/form-field.tsx` (`FormField`):** Molecule wrapper universal yang menerima:
       - `label?: string`
       - `htmlFor?: string`
       - `required?: boolean` (menampilkan `*` berwarna destructive)
       - `message?: string` (helper text di bawah kontrol)
       - `errorMessage?: string` (menampilkan pesan error dengan styling destructive; saat ada error, `errorMessage` diprioritaskan/ditampilkan jelas)
       - `children: React.ReactNode` (slot kontrol input apa pun)
    2. **`molecules/icon-select.tsx` (`IconSelect`):** Pasangan simetris dari [`IconInput`](file:///home/ruslan/workspace/salt/fe-assessment/fe-assignment-2/shared/presentation/components/molecules/icon-input.tsx) untuk Radix/shadcn `Select` dengan icon di sebelah kiri trigger.
    3. **`molecules/text-field.tsx` (`TextField` / `FieldInput`):** Komponen shorthand siap pakai sesuai kebutuhan yang dianalisa, yang **mengkomposisikan `FormField` + `IconInput` (atau `Input` jika `icon` tidak diisi)** sehingga tetap ZERO duplikasi kode:
       - Props: seluruh props `Input` + `label`, `required`, `message`, `errorMessage`, `icon?: React.ReactNode`, `containerClassName`, `fieldClassName`.
       - Otomatis meneruskan `aria-invalid={Boolean(errorMessage)}` dan menghubungkan `id` ke `Label htmlFor`.

---

## 3. Pemetaan Komponen dari Referensi UI

| Bagian di Referensi UI | Layer | Komponen | Status |
|---|---|---|---|
| Surface card / container luar & footer | Atom | `Card`, `CardContent`, `CardFooter`, dll. (`@atoms/card`) | **Baru (shadcn `card`)** |
| Label form | Atom | `Label` (`@atoms/label`) | **Baru (shadcn `label`)** |
| Input teks dasar | Atom | `Input` (`@atoms/input`) | Sudah ada |
| Dropdown select | Atom | `Select*` (`@atoms/select`) | **Baru (shadcn `select`)** |
| Multiline bio/notes | Atom | `Textarea` (`@atoms/textarea`) | **Baru (shadcn `textarea`)** |
| Tombol `Cancel` & `Save Changes` | Atom | `Button` (`@atoms/button`) | Sudah ada |
| Section dengan `title` + `subtitle` + body | Molecule | `SectionCard` (`@molecules/section-card`) | **Baru** |
| Wrapper `label` + `required` + `message` + `errorMessage` | Molecule | `FormField` (`@molecules/form-field`) | **Baru** |
| Input teks + icon di kiri | Molecule | `IconInput` (`@molecules/icon-input`) | Sudah ada |
| Select + icon di kiri | Molecule | `IconSelect` (`@molecules/icon-select`) | **Baru** |
| Field text input siap pakai (komposisi `FormField` + `IconInput`/`Input`) | Molecule | `TextField` (`@molecules/text-field`) | **Baru** |
| Form Create Member (kolom bisnis, grid 2 kolom, RHF + Zod, submit) | Feature UI | `CreateMemberForm` (`@member/presentation/components/ui/create-member-form.tsx`) | Tahap berikutnya (di luar `shared/`) |

---

## 4. Rencana Struktur File & Kontrak Props (`shared/presentation/components/`)

### Tahap 1 — Tambah Atom Primitives via shadcn CLI
1. `npx shadcn@latest add card -y` -> `shared/presentation/components/atoms/card.tsx` *(atau dipecah ke `atoms/card/*` seperti `atoms/table/*` jika ingin seragam)*
2. `npx shadcn@latest add label -y` -> `shared/presentation/components/atoms/label.tsx`
3. `npx shadcn@latest add select -y` -> `shared/presentation/components/atoms/select.tsx` *(atau `atoms/select/*`)*
4. `npx shadcn@latest add textarea -y` -> `shared/presentation/components/atoms/textarea.tsx`

### Tahap 2 — Buat Molecules Agnostic Baru
1. **`shared/presentation/components/molecules/section-card.tsx`**
   - Props utama:
     - `title: string`
     - `subtitle?: string`
     - `headerAction?: React.ReactNode`
     - `footer?: React.ReactNode`
     - `children: React.ReactNode`
     - `className?: string`, `contentClassName?: string`
   - Hanya merender `subtitle`, `headerAction`, dan `footer` jika diberikan (mengikuti pola bersih [`Header`](file:///home/ruslan/workspace/salt/fe-assessment/fe-assignment-2/shared/presentation/components/molecules/header.tsx)).
2. **`shared/presentation/components/molecules/form-field.tsx`**
   - Props utama:
     - `label?: string`
     - `htmlFor?: string`
     - `required?: boolean`
     - `message?: string`
     - `errorMessage?: string`
     - `children: React.ReactNode`
     - `className?: string`
   - Merender `<Label>` + tanda `*` jika `required`, slot `children`, lalu `errorMessage` (jika ada) atau `message`.
3. **`shared/presentation/components/molecules/icon-select.tsx`**
   - Props utama:
     - `icon?: React.ReactNode`
     - `options: Array<{ label: string; value: string; disabled?: boolean }>` *(atau mendukung `children` untuk fleksibilitas)*
     - `placeholder?: string`, `value?: string`, `defaultValue?: string`, `onValueChange?: (value: string) => void`, `disabled?: boolean`, `invalid?: boolean`, `id?: string`
   - Mengikuti layout icon kiri (`pl-9`) yang sama persis dengan `IconInput` (bisa mengekstrak helper/class konstan bersama atau slot icon kiri agar tidak duplikasi styling antara `IconInput` dan `IconSelect`).
4. **`shared/presentation/components/molecules/text-field.tsx`** *(shorthand field input siap pakai)*
   - Props: gabungan `FormField` (`label`, `required`, `message`, `errorMessage`) + `IconInput`/`Input` (`icon`, `className`, `containerClassName`, plus seluruh native props `<input>`).
   - Menggunakan `useId()` sebagai fallback `id` bila caller tidak mengirim `id`, sehingga `<Label htmlFor>` selalu terhubung.
   - *(Opsional jika diperlukan)* `select-field.tsx` (`FormField` + `IconSelect`) dan `textarea-field.tsx` (`FormField` + `Textarea`) dengan pola komposisi tipis yang sama.

### Tahap 3 — Unit Tests & Verifikasi Kualitas
Setiap atom/molecule baru dilengkapi unit test Vitest + React Testing Library di `__tests__/`:
- `atoms/__tests__/card.test.tsx`, `label.test.tsx`, `select.test.tsx`, `textarea.test.tsx`
- `molecules/__tests__/section-card.test.tsx`, `form-field.test.tsx`, `icon-select.test.tsx`, `text-field.test.tsx`
- Verifikasi akhir: `npm run typecheck`, `npm run lint`, dan `npx vitest run`.

---

## 5. Catatan untuk Tahap Integrasi Feature (`CreateMemberForm` — Tahap Berikutnya)

Saat nanti masuk ke pembuatan `CreateMemberForm` di `features/member/presentation/components/ui/`:
- Data dropdown **Department** sudah tersedia dari `getAllDepartmentController()` (`GET /api/departments`).
- Data dropdown **Employment Type** sudah tersedia dari `getAllEmploymentTypeController()` (`GET /api/employment/types`).
- **Perbedaan dengan Mock API saat ini:** Di [member.entity.ts](file:///home/ruslan/workspace/salt/fe-assessment/fe-assignment-2/features/member/domain/member.entity.ts) dan [app/api/members/route.ts](file:///home/ruslan/workspace/salt/fe-assessment/fe-assignment-2/app/api/members/route.ts), payload `CreateMemberPayload` saat ini baru mencakup `name`, `email`, `role`, `department`, `status`, dan `joinDate?` (belum ada field `employmentType` maupun `bio`/`notes`). Saat integrasi nanti kita perlu memutuskan apakah mock API & entity ikut diperluas atau field tersebut opsional di form.

