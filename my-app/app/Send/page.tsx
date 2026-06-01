export default function SendPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center text-white/70">
      <h1 className="text-4xl font-bold">Send Files</h1>
      <p className="text-center mt-4 text-lg max-w-xl">
        Create a room and share the 6 Digit code with your recipient to start
        transferring files securely and directly between your devices.
      </p>

      <div>
        <div></div>

        <div>
          <h1>Room ID: </h1>
          <div>
            <div>{/* Room ID display */}</div>
            <div>{/* Copy to clipboard button */}</div>
          </div>
        </div>

        {/* File upload section */}
        <div>
          <img src="" alt="" />
          <p>Upload The File or Folder</p>
          <p>Select files or folders to upload....</p>

          <div>
            <button>Select Files</button>
            <button>Select Folder</button>
          </div>
        </div>

        {/* Instruction Div */}
        <div>
          <h2>How to Use</h2>
          <p>1. Create a room by clicking "Create Room"</p>
          <p>2. Share the 6-digit code with your recipient</p>
          <p>3. Upload files or folders to the room</p>
        </div>

        {/* Footer */}
        <div>
          <div>
            <img src="" alt="" />
          </div>

          <div>
            <p>Note:</p>
            <p>
              CosmoDrop does not store data on a backend database. To prevent
              data loss or room disconnection, please do not close or switch
              this tab until the file transfer is fully complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
