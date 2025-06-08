<?php

namespace App\Http\Controllers;
use App\Models\Pendaftaran;
use App\Models\Kelas;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Livewire\Features\SupportEvents\Event;
use Inertia\Inertia;
use DB;

class PendaftaranController extends Controller
{
    public function index(){
        $pembayaran = Pembayaran::with('pendaftaran.kelas', 'pendaftaran.peserta')
        ->whereHas('pendaftaran', function ($query) {
            $query->where('id_peserta', auth()->id());
        })
        ->get();
    
        return Inertia::render('Pembayaran', [
            'pembayaran' => $pembayaran,
        ]);
    }
    public function myCourse(){
        $pembayaran = Pembayaran::with('pendaftaran.kelas', 'pendaftaran.peserta')
        ->whereHas('pendaftaran', function ($query) {
            $query->where('id_peserta', auth()->id());
        })
        ->where('status', 'lunas')
        ->get();
    
        return Inertia::render('MyCourse', [
            'kursus' => $pembayaran,
        ]);
    }
    public function detail(Request $request, $id_pendaftaran)
    {
        $pembayaran = Pembayaran::with('pendaftaran.kelas')->where('id_pendaftaran', $id_pendaftaran)->first();
        // dd($pembayaran);
        return Inertia::render('DetailPembayaran', [
            'pembayaran' => $pembayaran,
        ]);
    }

    public function update(Request $request){
        DB::beginTransaction();
        try{
            $pembayaran = Pembayaran::find($request->id);
            if($pembayaran){
                $pembayaran->status = $request->status ?? null;
                $pembayaran->metode = $request->metode ?? null;
                $pembayaran->error = $request->error ?? null;
                $pembayaran->save();
                DB::commit();
                return Inertia::render('Pembayaran', [
                    'pembayaran' => Pembayaran::with('pendaftaran.kelas')
                    ->whereHas('pendaftaran.peserta', function ($query) {
                        $query->where('id_pengguna', auth()->id());
                    })
                    ->get(),
                    'message' => 'Pembayaran Berhasil'
                ]);
            }else{
                DB::rollBack();
            }
        }catch (\Exception $e){
            DB::rollBack();
            return response()->json(['line' => $e->getLine(), 'file' => $e->getFile(), 'message' => $e->getMessage()], 400);
        }
    }

    public function store(Request $request, $id_kelas)
    {
        DB::beginTransaction();
        try {
            $kelas = Kelas::find($id_kelas);
   if (!$kelas) {
                        DB::rollBack();
                             return back()->withErrors(['message' => 'Kelas tidak ditemukan'], 404);
                     }
            $isExist = Pendaftaran::where('id_peserta', auth()->id())
                    ->where('id_kelas', $kelas->id_kelas)
                    ->first();
    
            if ($isExist) {
                DB::rollBack();
                return back()->withErrors([
                    'message' => 'Anda sudah terdaftar di kelas ini.'
                ]);
            }
            $pendaftaran = new Pendaftaran();
            $pendaftaran->id_peserta =  auth()->id();
            $pendaftaran->id_kelas = $id_kelas;
            $pendaftaran->status = 'aktif';
            $pendaftaran->save();
            
            // Set your Merchant Server Key
            \Midtrans\Config::$serverKey = config('midtrans.server_key');
            // Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
            \Midtrans\Config::$isProduction = config('midtrans.is_production');
            // Set sanitization on (default)
            \Midtrans\Config::$isSanitized = config('midtrans.is_sanitized');
            // Set 3DS transaction for credit card to true
            \Midtrans\Config::$is3ds = config('midtrans.is_3ds');
            
            $params = array(
                'transaction_details' => array(
                    'order_id' => rand(),
                    'gross_amount' => $kelas->harga,
                    )
                );
                
                $snapToken = \Midtrans\Snap::getSnapToken($params);
                
                $kode_terakhir = Pembayaran::latest()->first()->kode ?? null;
                $new_code = 'PURCHASE-001';
                if($kode_terakhir){
                    $last_code = substr($kode_terakhir, 9);
                    $new_code = 'PURCHASE-' . str_pad((int)$last_code + 1, 3, '0', STR_PAD_LEFT);
                }
                $pembayaran = new Pembayaran();
                $pembayaran->id_pendaftaran = $pendaftaran->id_pendaftaran;
                $pembayaran->kode = $new_code;
                $pembayaran->snap_token = $snapToken;
                $pembayaran->status = 'belum';
                $pembayaran->total_harga = $kelas->harga;
                $pembayaran->save();
                // dd($pembayaran);


            // return json()->json(['message' => 'Pendaftaran Berhasil', 'success' => true, 'status' => 201], 201);
            DB::commit();
            return Inertia::render('DetailPembayaran', [
                'pembayaran' => $pembayaran,
                'pendaftaran' => $pendaftaran,
                'snapToken' => $snapToken,
                'messsage' => 'Pendaftaran Berhasil'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
             return back()->withErrors(['message' => 'Pendaftaran Gagal', 'success' => false, 'status' => 500, 'error' => $th->getMessage(), 'line' => $th->getLine(), 'file' => $th->getFile(), 'trace' => $th->getTrace()], 500);
        }
    }
}
