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
      const res = await getAllMahasiswa();

      let data = [...res.data];

      // SEARCH
      if (query.q) {
        data = data.filter(
          (m) =>
            m.name
              ?.toLowerCase()
              .includes(query.q.toLowerCase()) ||
            m.nim
              ?.toLowerCase()
              .includes(query.q.toLowerCase())
        );
      }

      // SORT
      if (query._sort) {
        data.sort((a, b) => {
          const aVal = a[query._sort];
          const bVal = b[query._sort];

          if (query._order === "desc") {
            return aVal > bVal ? -1 : 1;
          }

          return aVal > bVal ? 1 : -1;
        });
      }

      const total = data.length;

      // PAGINATION
      const start =
        ((query._page || 1) - 1) *
        (query._limit || total);

      const end =
        start + (query._limit || total);

      data = data.slice(start, end);

      return {
        data,
        total,
      };
    },
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