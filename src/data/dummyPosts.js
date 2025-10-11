// 더미데이터(게시물)
const dummyPosts = [
  {
    id: 1,
    title: "종로 돌아본 곳 중에 추천!",
    content: {
      text: `오늘 가족과 함께 덕수궁 나들이를 다녀왔어요! 도심 한가운데 위치한 덕수궁은 전통과 근대가 어우러진 매력적인 공간이었어요. 정문인 대한문을 지나 석조전과 중화전을 둘러보며 조선과 근대의 역사를 함께 느낄 수 있었답니다. 특히, 돌담길을 따라 걷는 시간이 가장 좋았어요. 고즈넉한 분위기 속에서 가족과 이야기를 나누며 여유로운 시간을 보낼 수 있었어요. 마지막으로 정원에서 사진도 찍으며 추억을 남겼습니다. 역사와 자연이 조화로운 덕수궁, 가족 나들이 코스로 추천합니다!`,
      images: [
        "https://ko.skyticket.com/guide/wp-content/uploads/2024/09/4838d156-shutterstock_2343673449.jpg",
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/33/f2/f0/caption.jpg?w=1200&h=700&s=1",
      ],
    },
    author: {
      userId: "honggildong",
      username: "홍길동",
      profileImage: "",
      bio: "서울의 숨은 명소를 찾아다니는 여행자",
      followerCount: 245,
    },
    stats: {
      views: 1245,
      likes: 89,
      bookmarks: 34,
      shares: 12,
      isLiked: false,
      isBookmarked: false,
    },
    metadata: {
      createdAt: "2024-02-15T14:30:00",
      modifiedAt: "2024-02-16T09:15:00",
      location: {
        name: "청계천",
        address: "서울 종로구",
        district: "종로구",
        coordinates: {
          lat: 37.5469,
          lng: 127.0432,
        },
      },
      tags: ["중구", "덕수궁", "가족 나들이"],
    },
    comments: [
      {
        id: 101,
        author: {
          userId: "user456",
          username: "산책러버",
          profileImage: "/images/profiles/user456.jpg",
        },
        content: "정말 유용한 정보 감사합니다! 다음 주말에 가볼게요",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: false,
      canReport: true,
    },
  },
  {
    id: 2,
    title: "경복궁 역사여행",
    content: {
      text: `오늘 가족과 함께 덕수궁 나들이를 다녀왔어요! 도심 한가운데 위치한 덕수궁은 전통과 근대가 어우러진 매력적인 공간이었어요. 정문인 대한문을 지나 석조전과 중화전을 둘러보며 조선과 근대의 역사를 함께 느낄 수 있었답니다. 특히, 돌담길을 따라 걷는 시간이 가장 좋았어요. 고즈넉한 분위기 속에서 가족과 이야기를 나누며 여유로운 시간을 보낼 수 있었어요. 마지막으로 정원에서 사진도 찍으며 추억을 남겼습니다. 역사와 자연이 조화로운 덕수궁, 가족 나들이 코스로 추천합니다!`,
      images: [],
    },
    author: {
      userId: "seotogether",
      username: "서우리",
      profileImage: "",
      bio: "서울의 숨은 명소를 찾아다니는 여행자",
      followerCount: 245,
    },
    stats: {
      views: 1245,
      likes: 89,
      bookmarks: 34,
      shares: 12,
      isLiked: false,
      isBookmarked: false,
    },
    metadata: {
      createdAt: "2024-02-15T14:30:00",
      modifiedAt: "2024-02-16T09:15:00",
      location: {
        name: "경복궁",
        address: "서울 종로구",
        district: "종로구",
        coordinates: {
          lat: 37.5469,
          lng: 127.0432,
        },
      },
      tags: ["중구", "덕수궁", "역사탐방"],
    },
    comments: [
      {
        id: 101,
        author: {
          userId: "user456",
          username: "산책러버",
          profileImage: "/images/profiles/user456.jpg",
        },
        content: "정말 유용한 정보 감사합니다! 다음 주말에 가볼게요",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: false,
      canReport: true,
    },
  },
  {
    id: 3,
    title: "덕수궁 한번 가보세요! 완전 추천^^",
    content: {
      text: `오늘 가족과 함께 덕수궁 나들이를 다녀왔어요! 도심 한가운데 위치한 덕수궁은 전통과 근대가 어우러진 매력적인 공간이었어요. 정문인 대한문을 지나 석조전과 중화전을 둘러보며 조선과 근대의 역사를 함께 느낄 수 있었답니다. 특히, 돌담길을 따라 걷는 시간이 가장 좋았어요. 고즈넉한 분위기 속에서 가족과 이야기를 나누며 여유로운 시간을 보낼 수 있었어요. 마지막으로 정원에서 사진도 찍으며 추억을 남겼습니다. 역사와 자연이 조화로운 덕수궁, 가족 나들이 코스로 추천합니다!`,
      images: [],
    },
    author: {
      userId: "username",
      username: "username",
      profileImage: "",
      bio: "서울의 숨은 명소를 찾아다니는 여행자",
      followerCount: 245,
    },
    stats: {
      views: 1245,
      likes: 89,
      bookmarks: 34,
      shares: 12,
      isLiked: false,
      isBookmarked: false,
    },
    metadata: {
      createdAt: "2024-02-15T14:30:00",
      modifiedAt: "2024-02-16T09:15:00",
      location: {
        name: "덕수궁",
        address: "서울 중구",
        district: "중구",
        coordinates: {
          lat: 37.5469,
          lng: 127.0432,
        },
      },
      tags: ["중구", "덕수궁", "가족나둘이", "조선시대", "궁궐"],
    },
    comments: [
      {
        id: 101,
        author: {
          userId: "username",
          username: "username",
          profileImage: "/images/profiles/user456.jpg",
        },
        content: "저도 한번 가보고 싶네요~",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
      {
        id: 102,
        author: {
          userId: "seotogether",
          username: "서우리",
          profileImage: "/images/profiles/user456.jpg",
        },
        content: "덕수궁 완전 아름답네요!! 저도 꼭 가볼래요",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
      {
        id: 103,
        author: {
          userId: "user01",
          username: "user01",
          profileImage: "/images/profiles/user456.jpg",
        },
        content:
          "댓글이 엄청 길 경우에는 어떻게 표시되나요? 이런 식으로 표시되고, 댓글에 유해한 정보를 표시하는 것을 방지하기 위해 공백포함 100자는 어떤지요 현재는 93자입니다.",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: false,
      canReport: true,
    },
  },
  {
    id: 4,
    title: "올 봄, 청계천 나들이 어때요?",
    content: {
      text: `오늘 가족과 함께 덕수궁 나들이를 다녀왔어요! 도심 한가운데 위치한 덕수궁은 전통과 근대가 어우러진 매력적인 공간이었어요. 정문인 대한문을 지나 석조전과 중화전을 둘러보며 조선과 근대의 역사를 함께 느낄 수 있었답니다. 특히, 돌담길을 따라 걷는 시간이 가장 좋았어요. 고즈넉한 분위기 속에서 가족과 이야기를 나누며 여유로운 시간을 보낼 수 있었어요. 마지막으로 정원에서 사진도 찍으며 추억을 남겼습니다. 역사와 자연이 조화로운 덕수궁, 가족 나들이 코스로 추천합니다!`,
      images: [],
    },
    author: {
      userId: "seoulseek",
      username: "서울식",
      profileImage: "",
      bio: "서울의 숨은 명소를 찾아다니는 여행자",
      followerCount: 245,
      admin: true,
    },
    stats: {
      views: 1245,
      likes: 89,
      bookmarks: 34,
      shares: 12,
      isLiked: false,
      isBookmarked: false,
    },
    metadata: {
      createdAt: "2024-02-15T14:30:00",
      modifiedAt: "2024-02-16T09:15:00",
      location: {
        name: "청계천",
        address: "서울 종로구",
        district: "종로구",
        coordinates: {
          lat: 37.5469,
          lng: 127.0432,
        },
      },
      tags: ["중구", "덕수궁", "대한민국", "데이트코스", "산책"],
    },
    comments: [
      {
        id: 101,
        author: {
          userId: "username",
          username: "username",
          profileImage: "/images/profiles/user456.jpg",
        },
        content: "저도 한번 가보고 싶네요~",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
      {
        id: 102,
        author: {
          userId: "seotogether",
          username: "서우리",
          profileImage: "/images/profiles/user456.jpg",
        },
        content: "덕수궁 완전 아름답네요!! 저도 꼭 가볼래요",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
      {
        id: 103,
        author: {
          userId: "user01",
          username: "user01",
          profileImage: "/images/profiles/user456.jpg",
        },
        content:
          "댓글이 엄청 길 경우에는 어떻게 표시되나요? 이런 식으로 표시되고, 댓글에 유해한 정보를 표시하는 것을 방지하기 위해 공백포함 100자는 어떤지요 현재는 93자입니다.",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: false,
      canReport: true,
    },
  },
  {
    id: 5,
    title: "서울 야경 맛집 찐명소!",
    content: {
      text: `오늘 가족과 함께 덕수궁 나들이를 다녀왔어요! 도심 한가운데 위치한 덕수궁은 전통과 근대가 어우러진 매력적인 공간이었어요. 정문인 대한문을 지나 석조전과 중화전을 둘러보며 조선과 근대의 역사를 함께 느낄 수 있었답니다. 특히, 돌담길을 따라 걷는 시간이 가장 좋았어요. 고즈넉한 분위기 속에서 가족과 이야기를 나누며 여유로운 시간을 보낼 수 있었어요. 마지막으로 정원에서 사진도 찍으며 추억을 남겼습니다. 역사와 자연이 조화로운 덕수궁, 가족 나들이 코스로 추천합니다!`,
      images: [],
    },
    author: {
      userId: "leemujin",
      username: "이무진",
      profileImage: "",
      bio: "서울의 숨은 명소를 찾아다니는 여행자",
      followerCount: 245,
    },
    stats: {
      views: 1245,
      likes: 89,
      bookmarks: 34,
      shares: 12,
      isLiked: false,
      isBookmarked: false,
    },
    metadata: {
      createdAt: "2024-02-15T14:30:00",
      modifiedAt: "2024-02-16T09:15:00",
      location: {
        name: "봉은사",
        address: "서울 강남구",
        district: "강남구",
        coordinates: {
          lat: 37.5469,
          lng: 127.0432,
        },
      },
      tags: ["야경명소", "네온사인"],
    },
    comments: [
      {
        id: 101,
        author: {
          userId: "username",
          username: "username",
          profileImage: "/images/profiles/user456.jpg",
        },
        content: "저도 한번 가보고 싶네요~",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
      {
        id: 102,
        author: {
          userId: "seotogether",
          username: "서우리",
          profileImage: "/images/profiles/user456.jpg",
        },
        content: "덕수궁 완전 아름답네요!! 저도 꼭 가볼래요",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
      {
        id: 103,
        author: {
          userId: "user01",
          username: "user01",
          profileImage: "/images/profiles/user456.jpg",
        },
        content:
          "댓글이 엄청 길 경우에는 어떻게 표시되나요? 이런 식으로 표시되고, 댓글에 유해한 정보를 표시하는 것을 방지하기 위해 공백포함 100자는 어떤지요 현재는 93자입니다.",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: false,
      canReport: true,
    },
  },
  {
    id: 13,
    title: "서울숲에서 산책하기 좋은 코스 추천",
    content: {
      text: `서울숲 동쪽 입구에서 시작하는 추천 코스...`,
      images: [],
    },
    author: {
      userId: "user123",
      username: "서울탐험가",
      profileImage: "/images/profiles/user123.jpg",
      bio: "서울의 숨은 명소를 찾아다니는 여행자",
      followerCount: 245,
    },
    stats: {
      views: 1245,
      likes: 89,
      bookmarks: 34,
      shares: 12,
      isLiked: false,
      isBookmarked: false,
    },
    metadata: {
      createdAt: "2024-02-15T14:30:00",
      modifiedAt: "2024-02-16T09:15:00",
      location: {
        name: "서울숲",
        address: "서울 성동구 뚝섬로 273",
        district: "성동구",
        coordinates: {
          lat: 37.5469,
          lng: 127.0432,
        },
      },
      category: "공원",
      tags: ["산책로", "사진스팟", "가족코스"],
    },
    comments: [
      {
        id: 101,
        author: {
          userId: "user456",
          username: "산책러버",
          profileImage: "/images/profiles/user456.jpg",
        },
        content: "정말 유용한 정보 감사합니다! 다음 주말에 가볼게요",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: false,
      canReport: true,
    },
  },
  {
    id: 15,
    title: "서울숲에서 산책하기 좋은 코스 추천",
    content: {
      text: `서울숲 동쪽 입구에서 시작하는 추천 코스...`,
      images: [],
    },
    author: {
      userId: "user123",
      username: "서울탐험가",
      profileImage: "/images/profiles/user123.jpg",
      bio: "서울의 숨은 명소를 찾아다니는 여행자",
      followerCount: 245,
    },
    stats: {
      views: 1245,
      likes: 89,
      bookmarks: 34,
      shares: 12,
      isLiked: false,
      isBookmarked: false,
    },
    metadata: {
      createdAt: "2024-02-15T14:30:00",
      modifiedAt: "2024-02-16T09:15:00",
      location: {
        name: "서울숲",
        address: "서울 성동구 뚝섬로 273",
        district: "성동구",
        coordinates: {
          lat: 37.5469,
          lng: 127.0432,
        },
      },
      category: "공원",
      tags: ["산책로", "사진스팟", "가족코스"],
    },
    comments: [
      {
        id: 101,
        author: {
          userId: "user456",
          username: "산책러버",
          profileImage: "/images/profiles/user456.jpg",
        },
        content: "정말 유용한 정보 감사합니다! 다음 주말에 가볼게요",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: false,
      canReport: true,
    },
  },
  {
    id: 16,
    title: "서울숲에서 산책하기 좋은 코스 추천",
    content: {
      text: `서울숲 동쪽 입구에서 시작하는 추천 코스...`,
      images: [],
    },
    author: {
      userId: "user123",
      username: "서울탐험가",
      profileImage: "/images/profiles/user123.jpg",
      bio: "서울의 숨은 명소를 찾아다니는 여행자",
      followerCount: 245,
    },
    stats: {
      views: 1245,
      likes: 89,
      bookmarks: 34,
      shares: 12,
      isLiked: false,
      isBookmarked: false,
    },
    metadata: {
      createdAt: "2024-02-15T14:30:00",
      modifiedAt: "2024-02-16T09:15:00",
      location: {
        name: "서울숲",
        address: "서울 성동구 뚝섬로 273",
        district: "성동구",
        coordinates: {
          lat: 37.5469,
          lng: 127.0432,
        },
      },
      category: "공원",
      tags: ["산책로", "사진스팟", "가족코스"],
    },
    comments: [
      {
        id: 101,
        author: {
          userId: "user456",
          username: "산책러버",
          profileImage: "/images/profiles/user456.jpg",
        },
        content: "정말 유용한 정보 감사합니다! 다음 주말에 가볼게요",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: false,
      canReport: true,
    },
  },
  {
    id: 17,
    title: "서울숲에서 산책하기 좋은 코스 추천",
    content: {
      text: `서울숲 동쪽 입구에서 시작하는 추천 코스...`,
      images: [],
    },
    author: {
      userId: "user123",
      username: "서울탐험가",
      profileImage: "/images/profiles/user123.jpg",
      bio: "서울의 숨은 명소를 찾아다니는 여행자",
      followerCount: 245,
    },
    stats: {
      views: 1245,
      likes: 89,
      bookmarks: 34,
      shares: 12,
      isLiked: false,
      isBookmarked: false,
    },
    metadata: {
      createdAt: "2024-02-15T14:30:00",
      modifiedAt: "2024-02-16T09:15:00",
      location: {
        name: "서울숲",
        address: "서울 성동구 뚝섬로 273",
        district: "성동구",
        coordinates: {
          lat: 37.5469,
          lng: 127.0432,
        },
      },
      category: "공원",
      tags: ["산책로", "사진스팟", "가족코스"],
    },
    comments: [
      {
        id: 101,
        author: {
          userId: "user456",
          username: "산책러버",
          profileImage: "/images/profiles/user456.jpg",
        },
        content: "정말 유용한 정보 감사합니다! 다음 주말에 가볼게요",
        createdAt: "2024-02-15T15:20:00",
        likes: 5,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: false,
      canReport: true,
    },
  },
];

export default dummyPosts;
