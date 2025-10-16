import { Button } from "@/Components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export function SheetDetail({ title, item, trigger }) {
    const pendaftaran = item?.pendaftaran || {};
    const peserta = pendaftaran?.peserta || {};
    const kelas = pendaftaran?.kelas || {};

    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-xl">{title}</SheetTitle>
                </SheetHeader>

                <div className="px-1 py-4 space-y-6 text-sm text-gray-700">
                    {/* Informasi Pembayaran */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Informasi Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p>
                                <strong>Kode Transaksi:</strong> {item.kode}
                            </p>
                            <p>
                                <strong>Status:</strong> {item.status}
                            </p>
                            <p>
                                <strong>Total Harga:</strong> Rp{" "}
                                {parseInt(item.total_harga).toLocaleString(
                                    "id-ID"
                                )}
                            </p>
                            <p>
                                <strong>Metode:</strong> {item.metode || "-"}
                            </p>
                            <p>
                                <strong>Tanggal Pembayaran:</strong>{" "}
                                {new Date(item.created_at).toLocaleString(
                                    "id-ID",
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Informasi Peserta */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Informasi Peserta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p>
                                <strong>Nama:</strong> {peserta.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {peserta.email}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Informasi Kelas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Informasi Kelas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p>
                                <strong>Nama Kelas:</strong> {kelas.nama_kelas}
                            </p>
                            <p>
                                <strong>Kategori:</strong> {kelas.kategori}
                            </p>
                            <p>
                                <strong>Level:</strong> {kelas.level}
                            </p>
                            <p>
                                <strong>Harga Kelas:</strong> Rp{" "}
                                {parseInt(kelas.harga).toLocaleString("id-ID")}
                            </p>
                            <p>
                                <strong>Jadwal:</strong>{" "}
                                {new Date(kelas.jadwal).toLocaleString(
                                    "id-ID",
                                    {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <SheetFooter className="mt-6">
                    <SheetClose asChild>
                        <Button variant="outline">Tutup</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
