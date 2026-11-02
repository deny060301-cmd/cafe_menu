
const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// 메뉴 조회 및 검색
app.get("/", async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        let menus;

        if (keyword) {
            [menus] = await pool.query(
                "SELECT * FROM cafe WHERE menu LIKE ? ORDER BY id",
                [`%${keyword}%`]
            );
        } else {
            [menus] = await pool.query(
                "SELECT * FROM cafe ORDER BY id"
            );
        }

        res.render("index", { menus, keyword });
    } catch (err) {
        console.error(err);
        res.status(500).send("메뉴 조회 실패");
    }
});

// 메뉴 추가 페이지
app.get("/add", (req, res) => {
    res.render("add");
});

// 메뉴 등록
app.post("/add", async (req, res) => {
    try {
        const { menu, category, price } = req.body;

        await pool.query(
            "INSERT INTO cafe (menu, category, price) VALUES (?, ?, ?)",
            [menu, category, price]
        );

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("메뉴 추가 실패");
    }
});

// 메뉴 수정 페이지
app.get("/edit/:id", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM cafe WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).send("메뉴를 찾을 수 없습니다.");
        }

        res.render("edit", { menu: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("메뉴 조회 실패");
    }
});

// 메뉴 수정
app.post("/edit/:id", async (req, res) => {
    try {
        const { menu, category, price } = req.body;

        await pool.query(
            "UPDATE cafe SET menu = ?, category = ?, price = ? WHERE id = ?",
            [menu, category, price, req.params.id]
        );

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("메뉴 수정 실패");
    }
});

// 메뉴 삭제
app.post("/delete/:id", async (req, res) => {
    try {
        await pool.query(
            "DELETE FROM cafe WHERE id = ?",
            [req.params.id]
        );

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("메뉴 삭제 실패");
    }
});

app.listen(PORT, () => {
    console.log(`카페 메뉴 서버 실행: http://localhost:${PORT}`);
});

