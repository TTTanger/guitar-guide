## 核心技术点（必须掌握）

### 1. 加密算法实现
**重点代码**：
```javascript
// 必须能完整解释这个加密过程
export function encrypt(data, time) {
    const key = md5(time).slice(0);
    const dataLen = data.length;
    const keyLen = key.length;
    let encrypted = '';

    for (let i = 0; i < dataLen; i++) {
        const pChar = data[i];
        const kChar = key[i % keyLen];
        
        const pOffset = pChar.charCodeAt(0) - 32;
        const kOffset = kChar.charCodeAt(0) - 32;
        
        const cOffset = (pOffset + kOffset) % 95;
        encrypted += String.fromCharCode(cOffset + 32);
    }
    return encrypted;
}
```

**准备回答**：
- 为什么选择维吉尼亚加密变体？
- 为什么使用时间戳作为密钥？
- 为什么限制在可打印ASCII范围（32-126）？
- 如何确保前后端加密解密一致性？

### 2. 多语言翻译系统架构
**重点代码**：
```javascript
class LanguageController {
    async loadAllTranslations() {
        await this.loadLocalTranslations();
        await this.loadDbTranslations();
        const mergedTranslations = {};
        const allLangs = new Set([
            ...Object.keys(this.localTranslations), 
            ...Object.keys(this.dbTranslations)
        ]);
        allLangs.forEach(lang => {
            mergedTranslations[lang] = deepMerge(
                { ...(this.localTranslations[lang] || {}) },
                this.dbTranslations[lang] || {}
            );
        });
        this.mergedTranslations = mergedTranslations;
    }
}
```

**准备回答**：
- 为什么采用混合翻译系统？
- JSON文件和数据库翻译的区别？
- 如何处理翻译冲突？
- 如何实现动态语言切换？

### 3. 动态DOM操作
**重点代码**：
```javascript
function createChordCard(chord) {
    const card = document.createElement('div');
    card.className = 'chord-card';

    const h3 = document.createElement('h3');
    h3.textContent = chord.name;
    card.appendChild(h3);

    const imagesDiv = document.createElement('div');
    imagesDiv.className = 'img-container';
    
    const noteImg = document.createElement('img');
    noteImg.src = chord.noteImage;
    noteImg.alt = `${chord.name} note diagram`;
    imagesDiv.appendChild(noteImg);
    
    card.appendChild(imagesDiv);
    return card;
}
```

**准备回答**：
- 为什么选择动态创建而不是静态HTML？
- 如何处理事件绑定？
- 如何确保翻译功能在动态内容中生效？

### 4. 响应式设计实现
**重点代码**：
```css
@media (max-width: 767px) {
    nav {
        position: fixed;
        top: 60px;
        left: -200px;
        width: 200px;
        transition: left 0.3s ease;
    }
    
    nav.show {
        left: 0;
    }
}
```

```javascript
function initMobileLayout() {
    createMobileButtons();
    createOverlay();
    addEventListeners();
}
```

**准备回答**：
- 如何检测移动设备？
- 为什么使用transform而不是改变margin？
- 如何处理触摸事件？

## 架构设计问题

### 1. 项目结构
**准备回答**：
- 为什么这样组织文件结构？
- 前后端分离的设计思路？
- 如何确保代码的可维护性？

### 2. 数据库设计
**准备回答**：
- 用户表的设计考虑？
- 翻译表的结构设计？
- 如何确保数据安全性？

### 3. 安全性考虑
**准备回答**：
- 如何防止SQL注入？
- 如何防止XSS攻击？
- 会话管理的安全性？

## 可能被问到的技术细节

### 1. AJAX实现
```javascript
// 准备解释这个AJAX流程
fetch('../phps/auth.php')
    .then(response => response.json())
    .then(data => {
        if (!data.loggedin) {
            window.location.href = 'login.html';
        }
    })
    .catch(error => {
        console.error('Auth check failed:', error);
        window.location.href = 'login.html';
    });
```

### 2. 会话管理
```php
// 准备解释会话验证流程
session_start();
$response = array(
    'loggedin' => isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true,
    'username' => isset($_SESSION['username']) ? $_SESSION['username'] : null,
);
```

### 3. 文件上传处理
```php
// 准备解释文件上传的安全考虑
function postAvatar($id, $conn) {
    $file = $_FILES['avatar'];
    $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    if (!in_array($file_ext, $allowedTypes)) {
        return false;
    }
    
    $new_file_name = uniqid() . '.' . $file_ext;
}
```

## 演示准备

### 1. 功能演示顺序
1. **登录系统** - 展示加密和会话管理
2. **多语言切换** - 展示翻译系统
3. **和弦学习** - 展示动态DOM操作
4. **响应式设计** - 展示移动端适配
5. **用户管理** - 展示文件上传和密码修改

### 2. 代码演示重点
- 准备几个关键函数的完整代码
- 能够现场解释代码逻辑
- 准备回答"为什么要这样写"的问题

## 可能的问题和回答

### Q: 为什么选择这个加密算法？
**A**: 维吉尼亚加密比凯撒加密更安全，使用时间戳作为动态密钥增加了安全性，同时实现相对简单，便于前后端一致性验证。

### Q: 如何处理翻译的性能问题？
**A**: 采用混合系统，静态内容用JSON文件（快速加载），动态内容用数据库（便于管理），通过缓存机制优化性能。

### Q: 移动端适配的挑战是什么？
**A**: 主要挑战是导航栏的显示/隐藏逻辑，通过CSS transform和JavaScript事件处理实现流畅的用户体验。

### Q: 如何确保代码质量？
**A**: 使用ES6模块化，类封装，详细的注释，错误处理，以及代码复用。

## 最后建议

1. **准备一个完整的演示流程**
2. **熟悉每个功能的技术实现细节**
3. **准备回答"如果...会怎样"的问题**
4. **展示项目的创新点和超出要求的功能**
5. **准备讨论项目的改进方向**

记住，导师更关心的是您对技术的理解和思考过程，而不仅仅是代码本身。