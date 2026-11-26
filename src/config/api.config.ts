export const API_CONFIG = {
  // Địa chỉ server API, lấy từ .env.local.
  BASE_URL: process.env.NEXT_PUBLIC_API,

  ENPOINTS: {
    Auth: {
      // Gửi email, mật khẩu để đăng nhập.
      SIGN_IN: "/api/auth/signin",

      // Gửi thông tin để đăng ký tài khoản.
      SIGN_UP: "/api/auth/signup",
    },

    Destination: {
      // GET: lấy DANH SÁCH KHU VỰC.
      // Ví dụ: Quận 1 - Hồ Chí Minh, Cái Răng - Cần Thơ...
      // Dữ liệu: DestinationType[].
      GET_ALL: "/api/vi-tri",

      // GET: lấy MỘT KHU VỰC theo ID khu vực.
      // Ví dụ: ID 2 → thông tin Cái Răng, Cần Thơ.
      // Dữ liệu: DestinationType.
      GET_BY_ID: (destinationId: number) => `/api/vi-tri/${destinationId}`,
    },

    Rooms: {
      // GET: lấy DANH SÁCH TẤT CẢ PHÒNG, ở mọi khu vực.
      // Dữ liệu: RoomType[].
      GET_ALL: "/api/phong-thue",

      // GET: lấy CHI TIẾT MỘT PHÒNG theo ID phòng.
      // Ví dụ: ID 11 → tên, ảnh, giá, tiện nghi... của phòng 11.
      // Dữ liệu: RoomType.
      GET_BY_ID: (roomId: number) => `/api/phong-thue/${roomId}`,

      // GET: lấy DANH SÁCH PHÒNG thuộc một khu vực.
      // Ví dụ: maViTri=2 → các phòng thuộc Cái Răng, Cần Thơ.
      // Dữ liệu: RoomType[].
      GET_BY_LOCATION: (destinationId: number) =>
        `/api/phong-thue/lay-phong-theo-vi-tri?maViTri=${destinationId}`,

      // GET: lấy DANH SÁCH PHÒNG chia theo từng trang.
      // pageIndex: trang muốn lấy.
      // pageSize: số phòng trong một trang.
      // keyword: từ khóa tìm kiếm.
      // Dữ liệu: đối tượng phân trang, chứa danh sách phòng
      // và thông tin như tổng số phòng.
      GET_PAGINATED: (pageIndex: number, pageSize: number, keyword = "") => {
        const params = new URLSearchParams({
          pageIndex: String(pageIndex),
          pageSize: String(pageSize),
        });

        if (keyword.trim()) {
          params.set("keyword", keyword.trim());
        }

        return `/api/phong-thue/phan-trang-tim-kiem?${params.toString()}`;
      },
    },

    comments: {
      GET_ALL: "/api/binh-luan",

      GET_BY_ROOM_COMMENTS: (roomId: number) =>
        `/api/binh-luan/lay-binh-luan-theo-phong/${roomId}`,

      CREATE: "/api/binh-luan",

      UPDATE: (commentId: number) => `/api/binh-luan/${commentId}`,

      DELETE: (commentId: number) => `/api/binh-luan/${commentId}`,
    },

    Booking: {
      GET_ALL: "/api/dat-phong",

      GET_BY_BOOKING: (bookingId: number) => `/api/dat-phong/${bookingId}`,

      GET_BY_USER: (userId: number) =>
        `/api/dat-phong/lay-theo-nguoi-dung/${userId}`,

      CREATE: "/api/dat-phong",

      UPDATE: (bookingId: number) => `/api/dat-phong/${bookingId}`,

      DELETE: (bookingId: number) => `/api/dat-phong/${bookingId}`,
    },
  },
};
