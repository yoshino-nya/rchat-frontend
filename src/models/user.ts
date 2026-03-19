export class User {
  private static _userId: number | null = null // 当前用户 ID，初始化为 null

  // 获取当前用户 ID
  static getCurrentUserId(): number | null {
    if (this._userId === null) {
      // 如果当前用户 ID 未存储，尝试从 localStorage 获取
      this._userId = Number(localStorage.getItem('userId'))
      console.log(localStorage.getItem('userId'))
    }
    return this._userId
  }

  // 设置当前用户 ID，并同步到 localStorage
  static setCurrentUserId(userId: number): void {
    this._userId = userId
    localStorage.setItem('userId', userId.toString())
  }

  // 清除用户 ID
  static clearUserId(): void {
    this._userId = null
    localStorage.removeItem('userId')
  }
}
