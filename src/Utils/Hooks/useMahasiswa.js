import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

export const useMahasiswa = (query = {}) =>
  useQuery({
    queryKey: ["mahasiswa", query],
    queryFn: async () => {
      const res = await getAllMahasiswa(query);

      return {
        data: Array.isArray(res.data)
          ? res.data
          : res.data?.data ?? [],
        total: Number(
          res.headers["x-total-count"] ??
          res.data?.total ??
          0
        ),
      };
    },
    keepPreviousData: true,
  });

export const useStoreMahasiswa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeMahasiswa,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["mahasiswa"],
      });

      toastSuccess("Mahasiswa berhasil ditambahkan!");
    },
    onError: () => {
      toastError("Gagal menambahkan mahasiswa.");
    },
  });
};

export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      updateMahasiswa(id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["mahasiswa"],
      });

      toastSuccess("Mahasiswa berhasil diperbarui!");
    },

    onError: () => {
      toastError("Gagal memperbarui mahasiswa.");
    },
  });
};

export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMahasiswa,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["mahasiswa"],
      });

      toastSuccess("Mahasiswa berhasil dihapus!");
    },

    onError: () => {
      toastError("Gagal menghapus mahasiswa.");
    },
  });
};